export class Comment {
  id?: number;
  userId:number;
  username?: string;
  productId: number;
  description:string;
  rate:number;
  date:Date;
  constructor(comment) {
    {
      this.id=comment.id||null;
      this.userId=comment.userId||null;
      this.productId=comment.productId||null;
      this.rate=comment.rate||null;
      this.username=comment.username||"";
      this.description=comment.description||"";
      this.date=comment.date||new Date();
    }
  }
}
