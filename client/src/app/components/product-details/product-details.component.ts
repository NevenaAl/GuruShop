import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Product } from 'src/app/entities/Product';
import * as query from 'src/strings/queries';
import { NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  productId: String;
  product: Product;
  discountPrice: number;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.productId = params['productId'];
        this.getProduct();
      })
  }


  getProduct() {
    this.apollo
      .watchQuery({
        query: query.ProductQuery,
        variables: {
          _id: this.productId,
        },
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.product = result.data.product.productPayload;
        this.discountPrice = this.product.discount==0? this.product.price : this.product.price * ((100 - this.product.discount)/100);
        this.loadImages();
      });

  }

  loadImages() {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageSize: NgxGalleryImageSize.Contain,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnailSize: NgxGalleryImageSize.Contain,
        imageAutoPlay: true,
        imageAutoPlayInterval: 9000,
        previewArrows: true,
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 400,
        preview: true
      }
    ];
    this.product.image.split(',').forEach(image => {
      this.galleryImages.push(
        {
          small:`http://localhost:3000/images/${image}`,
          medium :`http://localhost:3000/images/${image}`,
          big: `http://localhost:3000/images/${image}`
        }
      )
    });

  }
}
