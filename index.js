const SKYGEAR_ENDPOINT = 'https://awesometenten.skygeario.com/';
const SKYGEAR_API_KEY = '19f6c34425d94c7785639415eb96a40f';


// configuration
skygear.config({
  'endPoint': SKYGEAR_ENDPOINT, // Endpoint
  'apiKey': SKYGEAR_API_KEY, // API Key
}).then(() => {
  console.log("Skygear is running");
  return skygear.auth.signupAnonymously();
}).then(() => {
  return showContent();
}),(error) => {
  console.error(error);
};

document.getElementById("submit-blog-post").addEventListener("submit", (e) => {
  console.log("form is submitted!");
  e.preventDefault();
  const title = document.getElementById("title-input").value;
  const content = document.getElementById("content-input").value;

  const BlogPost = skygear.Record.extend("blogpost");
  const blogpost = new BlogPost ({
    "title": title,
    "content": content,
  });
  skygear.publicDB.save(blogpost).then((record) => {
    console.log(record);
    document.getElementById("title-input").value = "";
    document.getElementById("content-input").value = "";
  }).then(() => {
    return showContent();
  })
});

const showContent = () => {
  const BlogPost = skygear.Record.extend("blogpost");
  const queryBlogPost = new skygear.Query(BlogPost);
  queryBlogPost.addDescending('_created_at');

  skygear.publicDB.query(queryBlogPost).then((blogpost) => {

    const blogID = (blogpost) => {
      return blogpost.id;
    }

    const list = blogpost.map((blogpost) => {
      return `
        <article style='margin-top:40px;'>
          <h2>${blogpost.title}</h2>
          <p>${blogpost.createdAt}</p>
          <p style='margin-top:20px;'>${blogpost.content}</p>
          <form class="form-comment" id='${blogID(blogpost)}' />
            <input class="comment-text" type='text' placeholder="input comment here"/>
            <input class="comment-submit" type='submit' value="comment" />
          </form>
        </article>
      `
    }).join('');
    document.getElementById("content").innerHTML = list;
  }).then(() => {
    submitComment();
  });
}

const submitComment = () => {
  const forms = document.getElementsByClassName("form-comment");

  for (var i=0; i<forms.length; i++){
    forms.item(i).addEventListener("submit", (e) => {
      e.preventDefault();
      console.log(e);

      const BlogPost = skygear.Record.extend("blogpost");
      const blogpost = new BlogPost ({
        "id": e.target.id,
      });

      const commentInput = e.target[0].value;
      const Comment = skygear.Record.extend("comment");
      const comment = new Comment ({
        "comment": commentInput,
        "blogPost": new skygear.Reference(blogpost)
      });
    })
  }
}
