import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "../../../src";

import User from "./user/user";
import Review from "./review/review";
import Product from "./product/product";

import ReviewsResolver from "./review/resolver";
import ProductReviewsResolver from "./product/resolver";
import UserReviewsResolver from "./user/resolver";

@Module({
  imports: [
    TypeGraphQLModule.forFeature({
      orphanedTypes: [User, Review, Product],
    }),
  ],
  providers: [ReviewsResolver, ProductReviewsResolver, UserReviewsResolver],
})
export default class ReviewModule { }
