import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";

const db = client.db("olxClone")
const col = db.collection("products")


//==============================================
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `productImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//==============================================
const serviceAccount = {
    "type": "service_account",
    "project_id": "food-panda-a12e6",
    "private_key_id": "2ccfcc5dee32331af0fa09fb48778b0edc18489c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3fYrr/pZm6p4y\nLq0XHhSwa96SgpIR6tjQ3S4pGE30YCG0ZIr81BXsSu1rNl/xKHL3B4PPUMHoVbVH\n7/ljvYiu+rPPaESF6+dqEcMHNWTvZ+AUAtBWjxfaAEflSOrtNg+7etMMBOV4/sW0\nIS8PnsDosxXk0h7ZmquWvf3550JUOBxN/jeLEQ8ezynDjvIuklQB74+YJMhfVwbA\nsguLjSm0HcpsuB/7sdvlXl24iNk56LKsCrpNRC6lh+LKsavj+GqEswB+bJ8iiKwi\n62yT4xqAKSnUiIUyBGqpCVKGdk3ZW4PckG/oDDafS+H8ssocnMP92B6qmJboWJxr\nUHa2v5G/AgMBAAECggEAEwXyga4G1MutNAGv0048kd/VFvZvg2kIKntL3lnVNylC\nRUwJNtYcIb/Q5oUgJEXvyVmfmj5CpD5CiZ9BCUysn4uBWdbzB7lh6BbIU/Z+rO1l\nh12VUOwL6n+N9KD/LjGlJuhAeiYFzmoHgDnSgbmRQW7TrcH1DdVhxcKT0rVdpJJx\nc7ZqAM8Sgq5tZBK4f/yW3m5X82eBI4w3hsNdb10fctCMgk53QGJsHHPoRe6sHIRh\n2RssSg0iJHzS3IiYsRpxBGdFVxIP78681Y1Uvf5gNzu7tmQdmmFMrZz1BAWfJy/5\noegWP6GuLTTionSr40nwAGV1QWCgm9Z3gYl4hlZ6VQKBgQDxsVm03BxAA8teupip\nRRYbhSMGb0nNzQiUGVuCTP41Ts+mhykRaO9Sw/gDv3U6c8/Sz9lstVSv1HmIzhvV\n9Q4H+S4R32LvAlL5Iz/nspyMtkb5Lnd5HEhe8wYC9Rw0eqi35zZYYKxtv2V11mHM\nLKAEiibB75SlunDfld5W3jj5UwKBgQDCWi87JOv6/YQBzJ4FvnkUfGBjChfm2Gky\nNP2luE+p2mNloXBUJoZO7GMG/oXp0gDl1RvBZ+F41xXzACDp7rjfQ3M7u/pViPwC\ncyBnC8V7SOpPxAIDm4zLwbTq+DTZJ99uutSYNUvcSGV6Ik+fYx4ZsiUVQy+5Ut0x\nnXoIy1t8ZQKBgFOtlWNauaUoKycW73fbZXYNuDyoFyNbk1bDGL2aLoECUj5TmVJf\nxEwhcSLLDKk6I3/XWm2askFWDOXihhyjhUIZcWvarYQWh+ed3qg3XKATE6t9/Ps/\nYYcOGMy5VBSPSw6wzE342nn8xAHyQVXRNW2c7yJB8nMWg7HFT38/3PXlAoGBAL10\nyIHxNhDPvTU7z/dte/6aWCNznWUtJS8KNRCtIQtEloxl2WhOvbKGAOq6hrQuQS3K\nlmns6ACyOvVM9MjWK2WJDPX4AsoK5Q9GRxnsga/ynmbvfb8ijRe7Vq+PEYV2tvns\nKn3NxouQD0wF0nRfXOJTpI6blhQkUPeiuWmFQ0N5AoGAAub19gCRCqKkkptVmXO6\nF8gdIq8CuYAuCFHel/vCuYsOIdbEXfFsZPbbOgUc/lEzwQTq+Z6MV8xX43BtQTcd\nJ4dypd9O0XN+Oc04tEUYNCifoVvpULuZjibGo6zVYQmwOkNP1U4vTsVOjpBE3t6T\nYHppEoaE2PPlTxz7XI2UjBU=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-cfpxa@food-panda-a12e6.iam.gserviceaccount.com",
    "client_id": "112447346402337101346",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cfpxa%40food-panda-a12e6.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const bucket = admin.storage().bucket("food-panda-a12e6.appspot.com");

//==============================================

let router = express.Router()

router.post('/product', upload.any(), async (req, res, next) => {

    if (!req.body.title || !req.body.description || !req.body.price || !req.files || !req.files[0]) {
        res.status(403);
        res.send(`required parameters missing, 
            example request body:
            {
                title: "title"
                description: "description"
                price: "price"
                image: "image"
            }`);
        return;
    }

    console.log(req.files);
    console.log(req.files[0]);

    if (req.files && req.files[0] && req.files[0].size > 2000000) { // Check file size if a file is provided
        res.status(403).send({ message: 'File size limit exceeded, max limit 2MB' });
        return;
    }

    // Handle file upload only if a file is provided
    if (req.files && req.files[0])
        bucket.upload(
            req.files[0].path,
            {
                destination: `products/${req.files[0].filename}`,
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // Handle file upload and processing

                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is a public downloadable URL

                            // Continue handling text data
                            try {
                                const insertResponse = await col.insertOne({
                                    title: req.body.title, // Set to an empty string if not provided
                                    price: req.body.price,
                                    time: new Date(),
                                    image: urlData[0], // Set to an empty string if no file was provided
                                    description: req.body.description
                                });
                                console.log(insertResponse);
                                res.send('post created');
                            } catch (e) {
                                console.log("error inserting mongodb: ", e);
                                res.status(500).send({ message: 'server error, please try later' });
                            }

                            // Delete the uploaded file from the server folder (if a file was provided)
                            if (req.files && req.files[0]) {
                                try {
                                    fs.unlinkSync(req.files[0].path)
                                    //file removed
                                } catch (err) {
                                    console.error(err)
                                }
                            }
                        }
                    });
                } else {
                    console.log("err: ", err)
                    res.status(500).send({
                        message: "server error"
                    });
                }
            });

});

router.get('/products', async (req, res, next) => {

    try {
        const cursor = col.find({}).sort({ _id: -1 });
        let results = await cursor.toArray();
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

router.get('/product/:productId', async (req, res, next) => {

    const productId = new ObjectId(req.params.productId)

    try {
        const result = await col.findOne({_id: productId})
        res.send(result);
    } catch (error) {
        console.error(error);
    }
});

export default router