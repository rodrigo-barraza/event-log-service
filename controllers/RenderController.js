'use strict';
const RenderModel = require.main.require('./models/RenderModel');
const FavoriteModel = require.main.require('./models/FavoriteModel');
const LikeModel = require.main.require('./models/LikeModel');

const RenderController = {
    createRenderObject: (renderData) => {
        const renderObject = {
                id: renderData.id,
                thumbnail: renderData.thumbnail,
                image: renderData.image,
                style: renderData.style,
                cfg: renderData.cfg,
                prompt: renderData.prompt,
                sampler: renderData.sampler,
                createdAt: renderData.createdAt,
                aspectRatio: renderData.aspectRatio,
                like: renderData.like,
                likes: renderData.likes,
        }
        return renderObject;
	},
	insertRender: async (
		id, image, thumbnail, count, prompt, negativePrompt, sampler, cfg, style, 
		aspectRatio, headers) => {    
			let data, error, response;
			try {
					const Render = new RenderModel();
					Render.ip = headers.ip;
					Render.local = headers.local;
					Render.userAgent = headers.userAgent
					Render.session = headers.session;
					
					Render.id = id;
					Render.image = image;
					Render.thumbnail = thumbnail;
					Render.prompt = prompt;
					Render.negativePrompt = negativePrompt;
					Render.sampler = sampler;
					Render.cfg = cfg;
					Render.style = style;
					Render.count = count;
					Render.aspectRatio = aspectRatio;

					response = await Render.save()
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	countRenders: async () => {
			let data, error, response;
			try {
					response = await RenderModel.countDocuments({})
					if (response || response === 0) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getLatestRenders: async (limit = 1) => {
			let data, error, response;
			try {
					response = await RenderModel.find({}).sort({ _id: -1 }).limit(limit)
					if (response.length) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRender: async (id) => {
			let data, error, response;
			try {
					response = await RenderModel.find({id: id})
					if (response.length) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRenderByCountId: async (countField) => {
			let data, error, response;
			try {
					response = await RenderModel.findOne({ count: Number(countField) })
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRenderById2: async (id) => {
			let data, error, response;
			try {
					response = await RenderModel.findOne({ id: id })
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	// getRenderById: async (id, ip) => {
	//     let data, error, response;
	//     try {
	//         response = await RenderModel.aggregate([
	//             { $match: { id: id } },
	//             {
	//               $lookup: {
	//                 from: LikeModel.collection.name,
	//                 let: { renderId: "$id" },
	//                 pipeline: [
	//                   {
	//                     $project: {
	//                       renderIds: {
	//                         $filter: {
	//                           input: { $objectToArray: "$renderIds" },
	//                           as: "item",
	//                           cond: { $eq: ["$$item.v", true] },
	//                         },
	//                       },
	//                       ip: 1
	//                     },
	//                   },
	//                   { $match: { 
	//                     $expr: { 
	//                         $in: ["$$renderId", "$renderIds.k"]
	//                     } 
	//                 }},
	//                 ],
	//                 as: "like",
	//               },
	//             },
	//             {
	//               $set: {
	//                 likes: { $size: "$like" }
	//               },
	//             },
	//           ]).exec()
	//         if (response && response.length) {
	//             data = response[0]
	//             console.log(response[0].like[0].renderIds[0]);
	//             // I need to find a better aggregate query for this, rather than doing it manually, but at least it takes some load off the mongodb server.
	//             const likes = data.like;
	//             const didILikeThis = false;
	//             if (likes.length) {
	//                 likes.forEach((eachLike) => {
	//                     if (ip === eachLike.ip) {
	//                         didILikeThis = true;
	//                     }
	//                 })
	//             }
	//             data.like = didILikeThis
	//         }
	//     } catch (err) {
	//         error = err
	//     }
	//     return { data, error, response }
	// },
	getRenderById: async (id, ip) => {
			let data, error, response;
			try {
				response = await RenderModel.aggregate([
					{ $match: { id: id } },
					{
						$lookup: {
							from: LikeModel.collection.name,
							let: { renderId: "$id" },
							pipeline: [
								{
									$project: {
										renderIds: {
											$filter: {
												input: { $objectToArray: "$renderIds" },
												as: "item",
												cond: { $eq: ["$$item.v", true] },
											},
										},
										ip: 1,
									},
								},
								{
									$match: {
										$expr: {
											$in: ["$$renderId", "$renderIds.k"],
										},
									},
								},
							],
							as: "like",
						},
					},
					{
						$set: {
							likes: { $size: "$like" },
						},
					},
					{
						$addFields: {
							like: {
								$in: [ip, "$like.ip"],
							},
						},
					},
				]).exec();
		
				if (response && response.length) {
					data = response[0];
				}
			} catch (err) {
				error = err;
			}
			return { data, error, response };
		},
	getRandomWithLikes: async (ip) => {
			let data, error, response;
			try {
					const randomRender = await RenderModel.random();
					if (randomRender) {
							response = await RenderModel.aggregate([
									{ $match: { id: randomRender.id } },
									{
											$lookup: {
													from: LikeModel.collection.name,
													let: { renderId: "$id" },
													pipeline: [
															{
																	$project: {
																			renderIds: {
																					$filter: {
																							input: { $objectToArray: "$renderIds" },
																							as: "item",
																							cond: { $eq: ["$$item.v", true] },
																					},
																			},
																			ip: 1, // Add this line to include the "ip" field
																	},
															},
															{ $match: { $expr: { $in: ["$$renderId", "$renderIds.k"] } } },
													],
													as: "like",
											},
									},
									{
											$set: {
													likes: { $size: "$like" },
													like: {
															$cond: {
																	if: {
																			$gt: [
																					{
																							$size: {
																									$filter: {
																											input: "$like",
																											as: "likeItem",
																											cond: { $eq: ["$$likeItem.ip", ip] }, // Check if "ip" field matches the provided "ip" parameter
																									},
																							},
																					},
																					0,
																			],
																	},
																	then: true,
																	else: false,
															},
													},
											},
									},
							]).exec();
	
							if (response && response.length) {
									data = response[0];
							}
					}
			} catch (err) {
					error = err;
			}
			return { data, error, response };
	},
	getRandom: async () => {
			let data, error, response;
			try {
					response = await RenderModel.random()
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRandom2: async () => {
			let data, error, response;
			try {
					response = await RenderModel.random()
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	updateRenders: async () => {
			let data, error, response;
			try {
					response = await RenderModel.find({});
					response.forEach((render) => {
							render.deleted = false;
							// render.image = render.image.replace('https://generations.rod.dev/', 'https://renders.rod.dev/')
							// render.id = nanoid(11);
							render.save();
					});
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRendersByIP: async (ip) => {
			let data, error, response;
			try {
					response = await RenderModel.find({ ip: ip, deleted: { $ne: true} }).sort({ _id: -1 });
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getFavoriteRenders: async (ip) => {
			let data, error, response;
			try {
					response = await RenderModel.aggregate([
							{ $match: { ip: ip, deleted: { $ne: true } } },
							{
									$lookup: {
											from: FavoriteModel.collection.name,
											let: { renderId: "$id" },
											pipeline: [
											{
													$project: {
															renderIds: {
																	$filter: {
																			input: { $objectToArray: "$renderIds" },
																			as: "item",
																			cond: { $eq: ["$$item.v", true] },
																	},
															},
													},
											},
											{ $match: { $expr: { $in: ["$$renderId", "$renderIds.k"] } } },
											],
											as: "favorite",
									},
							},
							{
							$unwind: "$favorite",
							},
							])
							.exec()
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRandomRenders: async (limit = 1) => {
			let data, error, response;
			let sizeLimit = limit <= 12 ? limit : 12;
			try {
					response = await RenderModel.aggregate([
							{ $match: { deleted: { $ne: true } } },
							{ $sample: { size: Number(sizeLimit) }}
					]);
					if (response) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getRenders: async (ip) => {
			let data, error, response;
			try {
				response = await RenderModel.aggregate([
					{ $match: { ip: ip, deleted: { $ne: true } } },
					{
						$lookup: {
							from: FavoriteModel.collection.name,
							let: { renderId: "$id" },
							pipeline: [
								{
									$project: {
										renderIds: {
											$filter: {
												input: { $objectToArray: "$renderIds" },
												as: "item",
												cond: { $eq: ["$$item.v", true] },
											},
										},
									},
								},
								{ $match: { $expr: { $in: ["$$renderId", "$renderIds.k"] } } },
							],
							as: "favorite",
						},
					},
					{
							$lookup: {
								from: LikeModel.collection.name,
								let: { renderId: "$id" },
								pipeline: [
									{
										$project: {
											renderIds: {
												$filter: {
													input: { $objectToArray: "$renderIds" },
													as: "item",
													cond: { $eq: ["$$item.v", true] },
												},
											},
											ip: 1
										},
									},
									{ $match: { 
											$expr: { 
													$in: ["$$renderId", "$renderIds.k"]
											} 
									}},

								],
								as: "like",
							},
					},
					{
							$set: {
									likes: { $size: "$like" },
									favorite: {
											$cond: {
											if: { $gt: [{ $size: "$favorite" }, 0] },
											then: true,
											else: false,
									},
								},
							},
						},
						{
							$addFields: {
								like: {
									$in: [ip, "$like.ip"],
								},
							},
						},
			]).sort({ _id: -1 }).exec()
					if (response && response.length) {
							data = response
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	deleteRender: async (id, ip) => {
			let data, error, response;
			try {
					response = await RenderModel.findOneAndUpdate(
							{ ip: ip, id: id }, 
							{ deleted: true })
					if (response) {
							data = response
					} else {
							error = { message: 'Render not found' }
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},
	getLikedRenders: async (ip) => {
			let data, error, response;
			try {
				response = await RenderModel.aggregate([
					{ $match: { deleted: { $ne: true } } },
					{
						$lookup: {
							from: FavoriteModel.collection.name,
							let: { renderId: "$id" },
							pipeline: [
								{
									$project: {
										renderIds: {
											$filter: {
												input: { $objectToArray: "$renderIds" },
												as: "item",
												cond: { $eq: ["$$item.v", true] },
											},
										},
									},
								},
								{ $match: { $expr: { $in: ["$$renderId", "$renderIds.k"] } } },
							],
							as: "favorite",
						},
					},
					{
							$lookup: {
								from: LikeModel.collection.name,
								let: { renderId: "$id" },
								pipeline: [
									{
										$project: {
											renderIds: {
												$filter: {
													input: { $objectToArray: "$renderIds" },
													as: "item",
													cond: { $eq: ["$$item.v", true] },
												},
											},
											ip: 1
										},
									},
									{
											$match: {
												$expr: {
													$in: ["$$renderId", "$renderIds.k"],
												},
												ip: ip, // Match documents with the passed IP
											},
										},
								],
								as: "like",
							},
					},
					{
							$set: {
									likes: { $size: "$like" },
								favorite: {
									$cond: {
										if: { $gt: [{ $size: "$favorite" }, 0] },
										then: true,
										else: false,
									},
								},
							},
					},
					{ $match: { like: { $ne: [] } } }
			]).sort({ _id: -1 }).exec()
					if (response && response.length) {
							data = response
					} else {
							data = []
					}
			} catch (err) {
					error = err
			}
			return { data, error, response }
	},

};

module.exports = RenderController;
