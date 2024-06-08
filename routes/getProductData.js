//Script to get farmers products from db and 
const express = require('express');
let purchaseModel=require("../models/purchaseModel");
let router=express.Router();

router.get("/:id",(req,res)=>{
  async function getRecentItems() {
    try {
      // const itemId= purchaseModel.itemId;
      const itemId=req.params.id;
      console.log(itemId)
      // Calculate the start date for the last 7 days
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);
// Calculate the end date for the current day
const endDate = new Date();
// Define the query
const query = {
  createdAt: {
    $gte: startDate,
    $lt: endDate
  }
};
// Retrieve elements created within the last 7 days and the current day

      // const recentItems = await  purchaseModel.find({ productId:itemId}).sort({ timestampField: -1 }).limit(7);
      const recentItems = await  purchaseModel.find({ productId:itemId}).find(query);

      return recentItems;
    } catch (error) {
      console.error('Error fetching recent items:', error);
      return [];
    }
  }
  
  // Usage
  getRecentItems()
    .then(items => {
      console.log('Recent Items:', items);
      res.json(items)
      // Do something with the recent items array
    })
    .catch(error => {
      console.error('Error:', error);
    });
})
module.exports=router