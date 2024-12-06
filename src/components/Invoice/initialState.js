export const initialState = {
    userID:'user',
    invoiceID:0,
    customerName:'',
    phoneNo:'',
    customerEmail:'',
    totalAmount:0,
    notes:'Thanks for your visit. Come Again!',
    paymentMode:'Paid',
    discount: 0,
    itemList:[{ _id: '', itemID:'', itemName:'', quantity:0, costPrice:0, rate:0, gst:0, amount:0 }],
    // createdAt: new Date(),
    createdAt: (() => {
        const now = new Date();
        const adjustedTime = new Date(now.getTime() + (5 * 60 + 30) * 60000);
        return new Date(adjustedTime);
    })(),
}