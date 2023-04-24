import express, {Request, Response} from 'express';
import * as UserService from "./controller/user";
import * as SurveyService from "./controller/survey";
const router = express.Router()

const apiKey: Array<string> = process.env.API_KEY ? process.env.API_KEY.split(",") : [];

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(403).json({
            status: 403,
            message: 'FORBIDDEN - Missing Authorization Key',
        })
    }

    if (!apiKey.includes(authHeader.trim())) {
        return res.status(403).json({
            status: 401,
            message: 'Unauthorized - Invalid Authorization Key'
        })
    }
    next()
});

// TODO add api key to the route.

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to anonymous contact tracing API');
});

// user routes
router.post('/user', UserService.createUser);
router.get('/user/name/:username', UserService.getUserByUserName);
router.get('/user/private/:privateId', UserService.getUserByPrivateId);
router.get('/user/public/:publicId', UserService.getUserByPublicId);
router.post('/user/contact', UserService.createContact);

// survey routes
router.post('/survey/update', SurveyService.updateSurvey)
router.post('/survey/getLastQuestion', SurveyService.getLastQuestion)


export default router;