// middleware to check userId and hasPremium
import { clerkClient } from '@clerk/express'
export const auth = async(req, res, next) => {
    try {
        const { userId, has } = await req.auth();

        const hasPremiumPlan = await has({ plan: 'premium' })

        const user = await clerkClient.users.getUser(userId);
        console.log(user)
        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free'
        next();

    } catch (error) {
        console.log(error)
            // res.json({ success: false, message: error.message })
        res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }

}