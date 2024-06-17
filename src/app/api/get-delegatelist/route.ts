import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const GET = async (req: NextRequest) => {
  const  page = 1 
  const limit = 40;
  const skip = (page - 1) * limit;

  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
   
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('user');
    await client.connect();
    const database = client.db('delegates-list');
    const collection = database.collection('op-delegates-list');

    const totalCount = await collection.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);


    if (id) {
      // Search by ID
      console.log("search api",id);
      const data = await collection
      .aggregate([
        { $match: { toDelegate: id } },
        {
          $addFields: {
            adjustedBalance: {
              $divide: [
                { $toDouble: "$newBalance" },
                { $pow: [10, 18] }
              ]
            },
            delegate: { $ifNull: ["$toDelegate", "$delegate"] }
          }
        },
        {
          $group: {
            _id: "$delegate",
            adjustedBalance: { $first: "$adjustedBalance" },
            newBalance: { $first: "$newBalance" }
          }
        }
      ])
      .toArray();
      // const data = await collection.findOne({ toDelegate: id });
        if(!data) {
          return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }
        console.log("search api",data);

      return NextResponse.json(data, { status: 200 });
    } else {
      // Pagination logic
      const totalCount = await collection.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);

      const data = await collection
        .aggregate([
          {
            $addFields: {
              adjustedBalance: {
                $divide: [
                  { $toDouble: "$newBalance" },
                  { $pow: [10, 18] }
                ]
              },
              delegate: { $ifNull: ["$toDelegate", "$delegate"] }
            }
          },
          {
            $group: {
              _id: "$delegate",
              adjustedBalance: { $first: "$adjustedBalance" },
              newBalance: { $first: "$newBalance" }
            }
          },
          { $sort: { adjustedBalance: -1 } },
          { $skip: skip },
          { $limit: limit }
        ])
        .toArray();


    return NextResponse.json(data, { status: 200 });
  }} catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
};
// import { MongoClient } from 'mongodb';

// export default async function handler(req:any, res:any) {
//   const { page = 1 } = req.query;
//   const limit = 40;
//   const skip = (page - 1) * limit;

//   const client = new MongoClient(process.env.MONGODB_URI!);

//   try {
//     await client.connect();
//     const database = client.db('delegates-list');
//     const collection = database.collection('op-delegates-list');

//     const totalCount = await collection.countDocuments();
//     const totalPages = Math.ceil(totalCount / limit);

//     const data = await collection
//       .find()
//       .sort({ newBalance: -1 })
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     res.status(200).json({
//       data,
//       currentPage: parseInt(page),
//       totalPages,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching data' });
//   } finally {
//     await client.close();
//   }
// }
