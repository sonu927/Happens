
{
    let createComment = function(){
        let commentForm = $('#comment-form');
        commentForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDOM(data.data.comment);
                    $('#post-comment-'+data.data.comment.post).prepend(newComment);
                    console.log(data);
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    let newCommentDOM = function(comment){
        return $(`
        <li id="comment-${comment._id}>
        <p>
            
                <small>
                    <a class="comment-delete-btn" href="/comments/destroy/${comment.id}">X</a>
                </small>    
            
            ${comment.content}
            <small>
                ${comment.user.name}
            </small>
        </p>
    </li>
        `)
    }

    createComment();
}