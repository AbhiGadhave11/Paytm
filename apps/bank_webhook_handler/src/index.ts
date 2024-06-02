import express from "express"
import db from "@repo/db/client"
const app = express();

app.use(express.json());
app.get('/hdfc',async (req,res) => {
    const paymentInformation:{
        token: string,
        userId: number,
        amount: number
    } = {
        token : req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.balance.update({
            where: {
                userId: paymentInformation.userId,
            },
            data:{
                amount: {
                    increment: paymentInformation.amount
                }
            }
        });

        await db.onRampTransaction.update({
            where: {
                token: paymentInformation.token
            },
            data: {
                status: "Success"
            }
        });
        res.status(200).json({
            msg: "Request Captured by DataBase"
        })
    } catch (e) {
        return res.status(411).json({
            msg: "Some problem haapens"
        })
    }
});

app.listen(3003, ()=>{
    console.log("Webhook server listened on 3003 port");
})