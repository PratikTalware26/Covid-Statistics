const express= require("express");
const { ObjectId } = require("mongoose");

const router= express.Router()
const collection_connection = require('../connector')

router.get('/totalRecovered', async (req, res)=>{
    try {
        // db.posts.updateOne( { title: "Post Title 1" }, { $set: { likes: 2 } } )
        // const covidDataUpdate = await collection_connection.updateMany({}, { $set: {_id:ObjectId("total")} } );
        // const covidData= await collection_connection.find({}, {recovered:1})
        const total= await collection_connection.aggregate([{$group: {_id:'total',recovered: {$sum: '$recovered'} }}])
        return res.status(200).json({
            data:total
        })
        
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message: error.message
        })
    }
})

router.get('/totalActive', async (req, res)=>{
    try {
        const activeCases= await collection_connection.aggregate([{$group:{_id:'total', active: {$sum : {$subtract:['$infected','$recovered']}}}}])
        return res.status(200).json({
            data:activeCases
        })
        
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
})

router.get('/totalDeaths', async (req, res)=>{
    try {
        const totalDeaths= await collection_connection.aggregate([{$group:{_id:'total', death: {$sum: '$death'}}}])

        res.status(200).json({
            data:totalDeaths
        })
        
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
})

router.get('/totalhotspotStates', async (req, res)=>{
    try {
        const hotspotStates= await collection_connection.aggregate([{$project:{_id:0, state:1, rate:{$round:[{$divide:[{$subtract:['$infected','$recovered']},'$recovered']}, 5]}}}, {$match:{rate:{$gt:0.1}}}]);

        return res.status(200).json({
            data: hotspotStates
        })
        
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
})

router.get('/healthyStates',async (req, res)=>{
    try {
        const healthyStates= await collection_connection.aggregate([{$project:{_id:0, state:1, mortality: {$round:[{$divide:['$death','$infected']}, 5]}}}, {$match:{mortality:{$lt:0.005}}}]);

        return res.status(200).json({
            data: healthyStates
        })
        
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
})

module.exports= router