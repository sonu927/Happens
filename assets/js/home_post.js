{
    //method to submit the form data for new post
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            var formData = new FormData(this);
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: formData,//convert form data into JSON
                processData: false, // Prevent jQuery from automatically processing the data
                contentType: false, // Prevent jQuery from automatically setting the content type

                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: 'Post Uploaded!!',
                        layout: 'topRight',
                        timeout: 1500 // Set the notification timeout (in milliseconds)
                      }).show();
                },error: function(error){
                    console.log(error.responseText);
                }

            })
        });
    }

    let newPostDom = function(post){
        return $(`
        <li id="post-${post._id}">
        <p>${post.user.name}</p>
        <img src="${post.photo}" alt="${post.caption}" width="200" height="200">
        <p>${post.caption}</p>
    
        <div id="post-comments">
            
                <form action="/comments/create" method="post">
                    <input type="text" name="content" id="" placeholder="comment here..">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add comment">
                </form>
            
    
            <div id="post-comments-list">
                <ul id="post-comment-${post._id}">
                    
    
                </ul>
    
            </div>
    
        </div>
    </li>
        `)
    }

    createPost();
}