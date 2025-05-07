package com.paf.cookMate.Controller;

import com.paf.cookMate.Model.Comment;
import com.paf.cookMate.Service.CommentService;
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
