package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.PasswordChangeRequest;
import com.paf.cookMate.Dto.UserDto;
import com.paf.cookMate.Service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paf.cookMate.Config.CurrentUser;
import com.paf.cookMate.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@CurrentUser String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(
            @CurrentUser String userId,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userId, userDto));
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(
            @CurrentUser String userId,
            @RequestBody PasswordChangeRequest req
    ) {
        userService.changePassword(userId, req);
        return ResponseEntity.ok("Password updated successfully");
    }

    // (Optionally keep POST if you ever need backward-compatibility)
    @PostMapping("/me/change-password")
    public ResponseEntity<?> changePasswordViaPost(
            @CurrentUser String userId,
            @RequestBody PasswordChangeRequest req
    ) {
        userService.changePassword(userId, req);
        return ResponseEntity.ok("Password updated successfully");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(@CurrentUser String userId) {
        userService.deleteCurrentUser(userId);
        return ResponseEntity.ok("Account deleted");
    }



    @PutMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable String id,
                                        @AuthenticationPrincipal User currentUser) {
        return userService.followUser(id, currentUser);
    }

    @PutMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String id,
                                          @AuthenticationPrincipal User currentUser) {
        return userService.unfollowUser(id, currentUser);
    }

    @PostMapping("/me/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @CurrentUser String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file uploaded.");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body("No file name provided.");
            }

            String ext = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
            if (!ext.matches("\\.(jpg|jpeg|png|gif)$")) {
                return ResponseEntity.badRequest().body("Invalid file type.");
            }

            String uploadDir = System.getProperty("user.dir") + "/uploads/profiles/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = userId + ext;
            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            String imageUrl = "http://localhost:8080/uploads/profiles/" + fileName + "?t=" + System.currentTimeMillis();

            UserDto existing = userService.getUserById(userId);
            UserDto updated = new UserDto();
            updated.setName(existing.getName());
            updated.setEmail(existing.getEmail());
            updated.setBio(existing.getBio());
            updated.setPhoneNumber(existing.getPhoneNumber());
            updated.setProfilePicture(imageUrl);

            userService.updateUser(userId, updated);
            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.toString());
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithGroq(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String userPrompt = payload.get("prompt");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = Map.of(
                    "model", "llama3-8b-8192",
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are a friendly and expert cooking assistant. Only answer cooking-related questions like recipes, ingredients, and kitchen techniques. If the question is not about cooking, politely decline with very short reply."),
                            Map.of("role", "user", "content", userPrompt)
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    request,
                    String.class
            );

            JsonNode root = new ObjectMapper().readTree(response.getBody());
            String aiReply = root.path("choices").get(0).path("message").path("content").asText();

            return ResponseEntity.ok(Map.of("response", aiReply));

        } catch (HttpClientErrorException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", "Unauthorized - Invalid API Key", "details", e.getStatusText())
            );

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(
                    Map.of("error", "Error communicating with Groq API", "details", e.getResponseBodyAsString())
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Unexpected error", "details", e.getMessage())
            );
        }
    }
}
