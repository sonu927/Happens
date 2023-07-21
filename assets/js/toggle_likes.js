{
    let ToggleLike = function(){
        let likeLink = $('.toggle-like-button');
        //let mainFrame = $('#main-frame-like');
        likeLink.click(function(e){
            e.preventDefault();
            let self = this;
            console.log($(self).attr('href'));

            $.ajax({
                type:'POST',
                url: $(self).attr('href')
            })
            .done(function(data){
                console.log(data);
                let reactCount = parseInt($(self).attr('data-likes'));
                let mainFrame = $('#main-frame-like-'+data.data.id);
                console.log(reactCount);
                if(data.data.deleted == true){
                    reactCount -= 1;
                }else{
                    reactCount += 1;
                }

                likeLink.attr('data-likes',reactCount);
                mainFrame.html(`${reactCount} ${data.data.reaction}`)
            })
            .fail(function(errData){
                console.log('error in completing the request',errData);
            });
        });
    }

    ToggleLike();
}