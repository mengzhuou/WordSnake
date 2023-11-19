import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import{ CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create( {jar} ));

var host = "http://localhost:8080";

var url = host + "/api/v1/";

export async function register(email: string, password: string, name: string, dob: string){
    let content = await client({
        method: 'post',
        url: url+"register",
        data:{
            email: email,
            password: password,
            name: name,
            dob: dob,
        }
    });
    return content;
}

export async function login(email: string, password: string){
    let content = await client({
        method: 'post',
        url: url+"login",
        data:{
            email: email,
            password: password,
        }
    });
    return content;
}


export async function logout(){
    let content = await client({
        method: 'post',
        url: url+"logout",
        withCredentials: true
    });
    return content;
}
export async function getWordAndDef(inputWord: string): Promise<String[]>{
    let content = await client({
        method: 'get',
        url: url+"getWordAndDef",
        params: {
          inputWord: inputWord
        },
        withCredentials: true
    });
    return content.data;
}

export async function getRandomStart(): Promise<String>{
    let content = await client({
        method: 'get',
        url: url+"getRandomStart",
        withCredentials: true
    });
    return content.data;
}


export async function isWordExist(inputWord: string): Promise<boolean>{
    let content = await client({
        method: 'get',
        url: url+"isWordExist",
        params: {
          inputWord: inputWord
        },
        withCredentials: true
    });
    return content.data;
}

export async function getLetterFromPreviousWord(inputWord: string): Promise<String>{
    let content = await client({
        method: 'get',
        url: url+"getLetterFromPreviousWord",
        params: {
          inputWord: inputWord
        },
        withCredentials: true
    });
    return content.data;
}

export async function getHintWordAndDef(inputWordLetter: string): Promise<String[]>{
    let content = await client({
        method: 'get',
        url: url+"getHintWordAndDef",
        params: {
            inputWordLetter: inputWordLetter
        },
        withCredentials: true
    });
    return content.data;
}

export async function getBestScore(){
    let content = await client({
        method: 'get',
        url: url+"getBestScore"
    });
    return content.data;
}

export async function updateBestScore(currentScore: number): Promise<number[][]>{
    let content = await client({
        method: 'post',
        url: url+"updateBestScore",
        params: {
            currentScore: currentScore
        },
    });
    return content.data;
}

export async function getUnlimitedBestScore(){
    let content = await client({
        method: 'get',
        url: url+"getUnlimitedBestScore"
    });
    return content.data;
}

export async function updateUnlimitedBestScore(currentScore: number): Promise<number[][]>{
    let content = await client({
        method: 'post',
        url: url+"updateUnlimitedBestScore",
        params: {
            currentScore: currentScore
        },
    });
    return content.data;
}


export async function getNumOfUsers(){
    let content = await client({
        method: 'get',
        url: url+"getNumOfUsers"
    });
    return content.data;
}

export async function getLeaderBoard(){
    let content = await client({
        method: 'get',
        url: url+"getLeaderBoard"
    });
    return content.data;
}

export async function getUnlimitedLeaderBoard(){
    let content = await client({
        method: 'get',
        url: url+"getUnlimitedLeaderBoard"
    });
    return content.data;
}

export async function getSignupRank(){
    let content = await client({
        method: 'get',
        url: url+"getSignupRank"
    });
    return content.data;
}

export async function isAdmin(){
    let content = await client({
        method: 'get',
        url: url+"isAdmin"
    });
    return content.data;
}

export async function addFeedback(message: string, rating: number): Promise<String[]>{
    let content = await client({
        method: 'post',
        url: url+"addFeedback",
        params: {
            message: message,
            rating: rating
        }
    });
    return content.data;
}

export async function getFeedback(){
    let content = await client({
        method: 'get',
        url: url+"getFeedback"
    });
    return content.data;
}

export async function updateFeedbackStatus(id: number, status: string){
    let content = await client({
        method: 'post',
        url: url+"updateFeedbackStatus",
        params: {
            id: id,
            status: status
        }
    });
    return content.data;
}

export async function getOnlineDefinition(word: string){
    let content = await client({
        method: 'post',
        url: url+"getOnlineDefinition",
        params:{
            word: word
        }
    });
    return content.data;
}

export async function requestForWordAddition(word: string){
    let content = await client({
        method: 'post',
        url: url+"requestForWordAddition",
        params:{
            word: word
        }
    });
    return content.data;
}

export async function isWordLegitimate(word: string){
    let content = await client({
        method: 'get',
        url: url+"isWordLegitimate",
        params:{
            word: word
        }
    });
    return content.data;
}

export async function isWordForAdditionExist(word: string){
    let content = await client({
        method: 'get',
        url: url+"isWordForAdditionExist",
        params:{
            word: word
        }
    });
    return content.data;
}

export async function getFromWordAddition(){
    let content = await client({
        method: 'get',
        url: url+"getFromWordAddition"
    });
    return content.data;
}

export async function storeWordDefinition(wordAdditionId: number){
    let content = await client({
        method: 'post',
        url: url+"storeWordDefinition",
        params:{
            wordAdditionId: wordAdditionId
        }
    });
    return content.data;
}

export async function deleteWordAdditionDefinition(wordAdditionId: number){
    let content = await client({
        method: 'post',
        url: url+"deleteWordAdditionDefinition",
        params:{
            wordAdditionId: wordAdditionId
        }
    });
    return content.data;
}