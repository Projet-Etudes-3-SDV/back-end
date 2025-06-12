import { AppError } from "../../utils/AppError";

export class CouponNotFound extends AppError {
  constructor() {
    super("Coupon non trouvé", 404, [], "COUPON_NOT_FOUND");
  }
}

export class CouponUpdateFailed extends AppError {
  constructor() {
    super("Échec de la mise à jour du coupon", 500, [], "COUPON_UPDATE_FAILED");
  }
}

export class CouponDeleteFailed extends AppError {
  constructor() {
    super("Échec de la suppression du coupon", 500, [], "COUPON_DELETE_FAILED");
  }
}


export class PromotionCodeNotFound extends AppError {
  constructor() {
    super("Code de promotion non trouvé", 404, [], "PROMOTION_CODE_NOT_FOUND");
  }
}