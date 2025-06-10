import { AppError } from "../../utils/AppError";

export class ProductAlreadyExists extends AppError {
  constructor() {
    super("Un produit avec ce nom existe déjà", 400, [], "PRODUCT_ALREADY_EXISTS");
  }
}

export class ProductNotFound extends AppError {
  constructor() {
    super("Produit non trouvé", 404, [], "PRODUCT_NOT_FOUND");
  }
}

export class ProductNegativePrice extends AppError {
  constructor() {
    super("Le prix ne peut pas être négatif", 400, [], "PRODUCT_NEGATIVE_PRICE");
  }
}

export class ProductNegativeStock extends AppError {
  constructor() {
    super("Le stock ne peut pas être négatif", 400, [], "PRODUCT_NEGATIVE_STOCK");
  }
}

export class ProductCategoryNotFound extends AppError {
  constructor() {
    super("Catégorie non trouvée", 404, [], "PRODUCT_CATEGORY_NOT_FOUND");
  }
}

export class ProductUpdateFailed extends AppError {
  constructor() {
    super("Échec de la mise à jour du produit", 500, [], "PRODUCT_UPDATE_FAILED");
  }
}

export class ProductDeleteFailed extends AppError {
  constructor() {
    super("Échec de la suppression du produit", 500, [], "PRODUCT_DELETE_FAILED");
  }
}
