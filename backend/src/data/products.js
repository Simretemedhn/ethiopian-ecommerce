// Temporary product data.
//
// Later, this information will come from MongoDB.
// For now, we are using a normal JavaScript array
// so that we can learn the API layer first.
//

const products = [

    {
        id: "p001",
        name: "Ethiopian Coffee",
        description: "Premium Ethiopian coffee beans",
        price: 450,
        category: "Coffee"
    },

    {
        id: "p002",
        name: "Ethiopian Honey",
        description: "Natural Ethiopian honey",
        price: 700,
        category: "Food"
    },

    {
        id: "p003",
        name: "Traditional Habesha Clothes",
        description: "Traditional Ethiopian clothing",
        price: 2500,
        category: "Clothing"
    }

];


// Export the products array.
//
// Another file can now import this data.
module.exports = products;