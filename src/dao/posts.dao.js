import { ObjectId } from 'bson';
let posts;
let postsdb;
const DEFAULT_SORT = [["date", -1]]

class PostsDAO{

	// Connection 
	static async injectDB(conn) {
		if(posts){
			return
		}
		try{
			postsdb = await conn.db(process.env.DB_NAME);
			posts = await postsdb.collection("posts");
		}
		catch( e){
			console.error(`Unable to establish collection handle in postsDAO:${e}`);
		}
	}

	// Get Post
	static async getPosts(query = {}, project = {}, sort = DEFAULT_SORT, page = 0, postsPerPage = 20) {
		let cursor;
		try{
			cursor = await posts.find(query).project(project).sort(sort);	
		}
		catch (e) {
			console.error(`Unable to issue find command ${e}`)
			return { postList: [], totalNumPosts: 0 }
		}

		const displayCursor = cursor.skip(postsPerPage*page).limit(postsPerPage);

		try{
			const postsList = await displayCursor.toArray();
			const totalNumPosts = (page === 0) ? await posts.countDocuments(query) : 0;
			return { postsList, totalNumPosts }
		}
		 catch (e) {
		 	console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
		 	return { postsList: [], totalNumPosts }
		 }
	}


	// Get Post by their id
	static async getPostByID(id) {
		try{
			const pipeline = [
				{
					'$match' : { '_id' : new ObjectId(id) }
			},
			{
				'$lookup': {
					'from': 'posts', 
					'let': {'id': '$_id'}, 
					'pipeline': [
						{
							'$match': {
								'$expr': {
									'$eq': [
									'$id', '$$id'
									]
								}
							}
						}, 
						{
							'$sort': {'date': -1}
						}
					], 
					'as': 'posts'
				}
			}
		];
		return await posts.aggregate(pipeline).next();
		}
		catch (e){
			console.error(`Something went wrong in getPostByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
		}
	} 

	static async createPost(title, author, body, permalink, date) {
		try{
			const postDoc = {
				_id : new ObjectId(),
				title : title,
				author : author,
				body : body,
				permalink: permalink,
				date : date
			}
			return await posts.insertOne(postDoc)
		} catch(e){
			console.error(`Unable to update post: ${e}`);
			return {error: e }
		}
	}

	// Update post
	static async updatePost(post, postID) {
		// let id = post._id;
        try {
            const updateResponse = await posts.updateOne(
                { _id: ObjectId(postID)},
                { $set: { title: post.title, author: post.author, body: post.body, permalink: post.permalink, date: post.date } },
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update post: ${e}`);
            return { error: e };
        }
    }


	// Delete Posts by their id
	static async deletePost(id) {
        try {
            const deleteResponse = await posts.deleteOne({
                _id: ObjectId(id)
            
            });

            return deleteResponse;
        } 
        catch (e) {
            console.error(`Unable to delete post: ${e}`);
            return { error: e };
        }
    }

}
export default PostsDAO;
