import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Comment extends Document {
    message: string;
    sender_id: mongoose.Types.ObjectId;
    post_id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<Comment>({
    message: {
        type: String,
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    }
}, { timestamps: true });

// We create a Model which controls the 'Comments' collection in MongoDB consisting of Comment documents defined by commentSchema
const CommentModel: Model<Comment> = mongoose.model<Comment>('Comments', commentSchema);
export default CommentModel;