package com.cookmate.backend.controller;

import com.cookmate.backend.model.Comment;
import com.cookmate.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    //  Edit an existing comment
    @PutMapping("/{commentId}")
    public Comment editComment(@PathVariable String commentId,
                                @RequestParam String newText) {
        return commentService.editComment(commentId, newText);
    }

    //  Delete an existing comment
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
    }
}
