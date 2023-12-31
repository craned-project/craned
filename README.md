- app
    - page.tsx (Should show list of posts)
    - [slug] (Should show {slug}'s posts)
    - signin (Sign in)
    - signup (Sign up)
- stories
    - Button (Client)
    - Posts (Server)
    - User Header
        - Small
        - Big
- tailwind
    - light/dark mode color
- Database
    - image
        - id (unique identifier for each image)
        - image (image goes to bucket and this is the id)
        - description (alt text, optional)
    - user
        - id (unique identifier for each user)
        - name (name of the user)
        - bio (biography of the user, optional)
        - pfp (profile picture of the user, references \`id\` in \`image\` table)
        - posts (array of post IDs that the user has made)
    - user_likes_post
        - user_id (ID of the user who liked the post, references \`id\` in \`user\` table)
        - post_id (ID of the post that was liked, references \`id\` in \`post\` table)
    - post
        - id (unique identifier for each post)
        - post_text (text of the post)
        - post_images (array of image IDs associated with the post)
        - post_comments (array of comment IDs associated with the post)
    - comment
        - id (unique identifier for each comment)
        - thecomment (ID of the post that the comment is associated with, references \`id\` in \`post\` table)
        - byuser (ID of the user who made the comment, references \`id\` in \`user\` table)
