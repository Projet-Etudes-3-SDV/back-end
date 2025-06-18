import { AppError } from "../../utils/AppError";

export class LandingNotFound extends AppError {
  constructor() {
    super("Landing non trouvé", 404, [], "LANDING_NOT_FOUND");
  }
}

export class MainLandingExists extends AppError {
  constructor() {
    super("Il ne peut y avoir qu'une seule landing principale", 400, [], "MAIN_LANDING_EXISTS");
  }
}

export class MainLandingNotFound extends AppError {
  constructor() {
    super("Landing principale non trouvée", 404, [], "MAIN_LANDING_NOT_FOUND");
  }
}

export class DuplicateProductOrder extends AppError {
  constructor() {
    super("Les ordres des produits doivent être uniques", 400, [], "DUPLICATE_PRODUCT_ORDER");
  }
}

export class DuplicateCategoryOrder extends AppError {
  constructor() {
    super("Les ordres des catégories doivent être uniques", 400, [], "DUPLICATE_CATEGORY_ORDER");
  }
}

export class DuplicateSectionOrder extends AppError {
  constructor() {
    super("L'ordre des sections doit être unique entre toutes les sections", 400, [], "DUPLICATE_SECTION_ORDER");
  }
}

export class CarouselProductNotFound extends AppError {
  constructor() {
    super("Produit non trouvé dans le carrousel", 404, [], "CAROUSEL_PRODUCT_NOT_FOUND");
  }
}