
import PostsDAO from "../dao/posts.dao.js"
import { User }  from "./users.controller.js"

export default class PostsContorller {


// Gets all Posts
	static async apiGetPosts(req, res, next){
		const POST_PER_PAGE = 20
		const { postsList, totalNumPosts } = await PostsDAO.getPosts();
		let response = {
			post: postsList,
			page: 0,
			filters: {},
			entries_per_page: POST_PER_PAGE,
			total_results: totalNumPosts,
		}
		res.json(response);
	}


// Gets a single post by the id
	static async apiGetPostById( req, res, next){
		try{
			let test = req;
			let id = req.params.id || {};
			let post = await PostsDAO.getPostByID(id);
			if (!post){
				res.status(404).json({ error: "Not found" });
				return;
			}
			let updated_type = post.lastupdated instanceof Date ? "Date" : "Other";
			res.json({ post, updated_type });
		}
		catch (e){
			console.log(`api ${e}`)
			res.status(500).json({ error: e})
		}
	}


// Creates a post
	static async apiCreatePost(req, res, next){
		try{
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
			var { error } = user
			if (error){
				res.status(401).json({ error })
				return
			}
			

		
			const title = req.body.title;
			const author = req.body.author;
			const body = req.body.body; 
			const permalink = req.body.permalink;
			const date = new Date();

			const postResponse = await PostsDAO.createPost(
				title,
				author,
				body,
				permalink,
				date,
			)
			res.json({ status : "success", postResponse })
		}catch(e){
			res.status(500).json({ error: e.message });
		}
	}


// Updates a post by the id
	static async apiUpdatePost( req, res, next){
		try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }


			const postID = req.params.id;
			const post = req.body

            const postResponse = await PostsDAO.updatePost(post, postID);

            var { error } = postResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (postResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update post",
                );
            }

            
            const updatedPost = await PostsDAO.getPostByID(postID);

            res.json({ post: updatedPost });
        } 
        catch (e) {
            res.status(500).json({ error: e.message });
        }	
	}



// Deletes a post
	static async apiDeletePost(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ".length);
            const user = await User.decoded(userJwt);
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }

            const postId = req.params.id;
           
            const postResponse = await PostsDAO.deletePost(postId);

            //const postId = req.body.post_id;

            //const { posts } = await PostsDAO.getPostByID(postId);
            res.json({ postResponse, success: "Post is deleted" });
        } 
        catch (e) {
            res.status(500).json({ e });
        }
    }

	
}

