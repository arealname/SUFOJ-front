export interface User{
    id:string,
    nickName:string,
    email:string,
    password:string,
    experience:number,
    level:number,
    location:string,
    school:string,
    tag:string,
    gender:string,
    easyResolve:number,
    meddleResolve:number,
    hardResolve:number,
    role:string,
    url:string,
    token:string,
    rank:number,
    fans:number,
    subscribe:number,
    sign:string,
    
}

export interface Blog{
    id:string,
    uid:string,
    context:string,
    title:string,
    type:string,
    like:number,
    star:number,
    tag:any,
    adminTags:any,
    faceImage:string,
    time:string,
    comment:number
    likeState:number,
    starState:number,
    subscribeState:number,
    user:User
}