const SKYGEAR_ENDPOINT = 'https://awesometenten.skygeario.com/';
const SKYGEAR_API_KEY = '19f6c34425d94c7785639415eb96a40f';

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
    "content": content
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
    console.log(blogpost);
    const list = blogpost.map((blogpost) => {
      return "<article style='margin-top:40px;'>"+
      "<h2>"+blogpost.title+"</h2>"+
      "<p>"+blogpost.createdAt+"</p>"+
      "<p style='margin-top:20px;'>"+blogpost.content+"</p>"+
      "</article>"
    }).join('');
    document.getElementById("content").innerHTML = list;
  });
};
