//Save comment with reference to a blogpost

const BlogPost = skygear.Record.extend('blogpost');
const blogpost = new BlogPost({
  'title': 'post title',
  'content':'post content'
});

skygear.publicDB.save(blogpost).then((savedBlogpost) => {
  const Comment = skygear.Record.extend('comment');
  const comment = new Comment({
    'comment': 'comment',
    'note': new skygear.Reference(savedBlogpost)
  })
  skygear.publicDB.save(comment);
});

//Query blogposts and their comments
const BlogPost = skygear.Record.extend('blogpost');
const Comment = skygear.Record.extend('comment');

const blogPostQuery = new skygear.Query(BlogPost);

const blogPostToElement = (blogPost, comments) => `
  <article style='margin-top:40px;'>
    <h2>${blogPost.title}</h2>
    <p>${blogPost.createdAt}</p>
    <p style='margin-top:20px;'>${blogPost.content}</p>
    <form class="form-comment" id='${blogID(blogPost)}' />
      <input class="comment-text" type='text' placeholder="input comment here"/>
      <input class="comment-submit" type='submit' value="comment" />
    </form>
    ${comments.map(commentToElement).join(' ')}
  </article>
`;

const commentToElement = (comment) => `<p>${c.comment}</p>`;

const queryBlogPostComments = (blogPost) => {
  const commentQuery = new skygear.Query(Comment);
  const blogPostRef = new skygear.Reference(blogPost);
  commentQuery.equalTo('blogpost', blogPostRef);
  return commentQuery;
};

skygear.publicDB.query(blogPostQuery).then((blogPosts) =>
  blogPosts
    // for each blog post
    .map((blogPost) =>
      skygear.publicDB
        // query comments of each blog post
        .query(queryBlogPostComments(blogPost))
        // render html elemnts for blog post and its comments
        .then((comments) => blogPostToElement(blogPost, comments));
    )
).then((elements) => {
  document.getElementById("content").innerHTML = elements.join(' ');
});
