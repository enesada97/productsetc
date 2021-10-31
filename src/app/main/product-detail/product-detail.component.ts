import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from './../../core/services/comment.service';
import { ProductService } from './../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/products.model';
import { first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Comment } from 'src/app/core/models/comment.model';
import { Subject } from 'rxjs';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product;
  comments: Comment[] = [];
  subscription$ = new Subject<void>();
  isRated = false;
  commentForm: FormGroup;
  currentUser:any;
  productId:number;
  totalComment=0;
  totalAvarage=0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
  }
  ngOnDestroy(): void {
    this.subscription$.next();
  }

  ngOnInit(): void {
    this.currentUser=localStorage.getItem('currentUser');
    this.activatedRoute.params.subscribe((params) => {
      this.productId=parseInt(params['id']);
      this.commentForm=this.createForm();
      this.getDetailById(this.productId);
    });
  }
  getDetailById(id) {
    this.productService
      .getById(id)
      .pipe(
        switchMap((data) => {
          this.product = data;
          return this.commentService.getByProductId(id);
        }),tap(x=>{
          let counter=0;
          this.totalComment=x?.length;
          x.forEach(element => {
            counter+=element?.rate;
          });
          this.totalAvarage=counter/x?.length;
        }
        ),
        takeUntil(this.subscription$)
      )
      .subscribe((c) => {
        this.comments = c;
        console.log(this.comments);
      });
  }
  createForm(){
    return this.fb.group({
      userId: [null],
      username: [''],
      productId: [null],
      description: [''],
      rate: [null],
      date: [new Date()]
  });
  }
  onRate($event: {
    newValue: number;
  }) {
    this.isRated = true;
    this.commentForm.get('rate')?.setValue($event.newValue);
  }
  submit() {
    if (this.commentForm.valid) {
      this.commentForm.get('userId')?.setValue(JSON.parse(this.currentUser)?.id);
      this.commentForm.get('productId')?.setValue(this.productId);
      this.commentForm.get('username')?.setValue(JSON.parse(this.currentUser)?.firstName+" "+JSON.parse(this.currentUser)?.lastName);
      console.log(this.commentForm.value);

    this.commentService.add(this.commentForm.value)
    .pipe(first())
    .subscribe(
        data => {
          alert("Success");
          let comment=new Comment({});
          comment=Object.assign({},this.commentForm.value);
          this.comments.push(comment);
          this.commentForm=this.createForm();
        },
        error => {
          console.log(error);
        });
    }
  }
}
