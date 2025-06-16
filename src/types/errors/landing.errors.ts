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