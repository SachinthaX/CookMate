package com.paf.cookMate.Service;

import com.paf.cookMate.Model.Comment;
import com.paf.cookMate.Repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class CommentService {

    private final CommentRepository commentRepository;

    //  Edit an existing comment
    public Comment editComment(String commentId, String newText) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setText(newText);  // Update the comment text
        return commentRepository.save(comment);  // Save updated comment
    }

    //  Delete an existing comment
    public void deleteComment(String commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(commentId);  // Delete comment by ID
    }
    
}
