import express, {Request, Response} from 'express';
import * as UserService from "./controller/user";
import * as SurveyService from "./controller/survey";
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

// TODO add api key to the route.

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to anonymous contact tracing API');
});

// user routes
router.post('/users', UserService.createUser);
router.get('/users/name/:username', UserService.getUserByUserName);
router.get('/users/private/:privateId', UserService.getUserByPrivateId);
router.get('/users/public/:publicId', UserService.getUserByPublicId);

// survey routs
router.post('/survey', SurveyService.createSurvey);



router.get('/survey', (req: Request, res: Response) => {

    res.send('Survey complete')
});

export default router;