
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
        <li class="comment-li" id="comment-${comment.id}">
        <div id="comment-header">
            <div id="c-img-content">
                <div id="c-img-container">
                    <img src="${comment.user.avatar}" alt="${comment.user.name}" >
                </div>
                
                <div>
                    <div>
                        <small>${comment.user.name}</small>
                        
                    </div>
                    <div>
                        <big>
                            <p style="margin: 0;">${comment.content}</p>
                        </big>
                        
                    </div>
                </div>
            </div>
    
            
                <div class="like-container">
                    <a id="main-frame-like-${comment.id}" href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=👍" data-likes="${comment.likes.length}" class="toggle-like-button like-btn">
                        
                            ${comment.likes.length} 👍
                        
                    </a>
                    <small>
                        <div class="reaction-container">
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=👍" data-likes="${comment.likes.length}" class="toggle-like-button">
                                 👍
                            </a>
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=❤️" data-likes="${comment.likes.length}" class="toggle-like-button">
                                 ❤️
                            </a>
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=😂" data-likes="${comment.likes.length}" class="toggle-like-button">
                                 😂
                            </a>
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=😲" data-likes="${comment.likes.length}" class="toggle-like-button">
                               😲
                            </a>
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=😥" data-likes="${comment.likes.length}" class="toggle-like-button">
                                 😥
                            </a>
                            <a  href="/likes/toggle/?id=${comment._id}&type=Comment&reaction=😡" data-likes="${comment.likes.length}" class="toggle-like-button">
                                 😡
                            </a>
                        </div>
                    </small>
                </div>
                
                    
                
            
            <div class="c-delete-btn">
                
                    
                        <a class="comment-delete-btn" href="/comments/destroy/${comment.id}"><i class="fas fa-trash"></i></a> 
                
            </div>
        </div>
       
        
    </li>
        `)
    }

    createComment();
}