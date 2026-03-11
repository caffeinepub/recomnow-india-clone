import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

import Runtime "mo:core/Runtime";
import Text "mo:core/Text";




actor {
  //////////////////////////////////////////////////
  // Types
  //////////////////////////////////////////////////

  type FashionCategory = {
    #sarees;
    #kurtaKurtis;
    #festive;
    #gowns;
    #salwarSuits;
    #lehengaCholis;
    #westernWear;
    #sportsWear;
  };

  type JewelleryCategory = {
    #necklaces;
    #rings;
  };

  type Category = {
    #fashion : FashionCategory;
    #jewellery : JewelleryCategory;
  };

  type Product = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    affiliateLink : Text;
    price : Nat;
    mrp : Nat;
    discountPercentage : Nat;
    category : Category;
    isFeatured : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  // Admin auth
  type AdminCredentials = {
    username : Text;
    password : Text; // Password hash (use text for simplicity)
  };

  //////////////////////////////////////////////////
  // Stable Vars
  //////////////////////////////////////////////////

  var nextId = 13;
  var adminToken = "admin-recomnow-secret-2024";

  let defaultAdmin : AdminCredentials = {
    username = "admin";
    password = "admin123";
  };

  var admin = defaultAdmin;

  // Use stable persistent data structures
  let products = Map.empty<Nat, Product>();

  //////////////////////////////////////////////////
  // Helper Functions
  //////////////////////////////////////////////////

  // rupees to paise
  func rupeesToPaise(rupees : Nat) : Nat {
    rupees * 100;
  };

  func createProduct(
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : Text,
    affiliateLink : Text,
    priceRupees : Nat,
    mrpRupees : Nat,
    discountPercentage : Nat,
    category : Category,
    isFeatured : Bool,
  ) : Product {
    {
      id;
      title;
      description;
      imageUrl;
      affiliateLink;
      price = rupeesToPaise(priceRupees);
      mrp = rupeesToPaise(mrpRupees);
      discountPercentage;
      category;
      isFeatured;
    };
  };

  //////////////////////////////////////////////////
  // Seed Data
  //////////////////////////////////////////////////

  let seedProducts = [
    createProduct(
      1,
      "Cotton Silk Saree - Sky Blue",
      "Elegant sky blue cotton silk saree with golden zari work. Perfect for festive occasions and weddings.",
      "/images/saree1.jpg",
      "https://www.amazon.in/dp/B01N9X7",
      1299,
      1999,
      35,
      #fashion(#sarees),
      true,
    ),
    createProduct(
      2,
      "Anarkali Kurta Set - Peach",
      "Peach colored Anarkali Kurta with palazzo pants. Intricate embroidered neckline.",
      "/images/kurta1.jpg",
      "https://www.amazon.in/dp/B07P2XH",
      999,
      1599,
      38,
      #fashion(#kurtaKurtis),
      false,
    ),
    createProduct(
      3,
      "Festive Silk Saree - Maroon",
      "Traditional maroon silk saree with stunning golden motifs. Includes matching blouse piece.",
      "/images/saree2.jpg",
      "https://www.amazon.in/dp/B06XG9Y",
      1499,
      2499,
      40,
      #fashion(#festive),
      true,
    ),
    createProduct(
      4,
      "Gold-plated Necklace Set",
      "Beautiful gold-plated necklace set with matching earrings. Traditional Indian design.",
      "/images/necklace1.jpg",
      "https://www.amazon.in/dp/B07WJ4Z",
      799,
      1299,
      39,
      #jewellery(#necklaces),
      false,
    ),
    createProduct(
      5,
      "Gown - Floral Print",
      "Flowy floral printed gown perfect for parties and casual outings. V-neck design.",
      "/images/gown1.jpg",
      "https://www.amazon.in/dp/B081C4",
      1199,
      1999,
      40,
      #fashion(#gowns),
      false,
    ),
    createProduct(
      6,
      "Ring - Kundan Polki",
      "Exquisite Kundan Polki ring with adjustable size. Ethnic Indian jewelry.",
      "/images/ring1.jpg",
      "https://www.amazon.in/dp/B07R5",
      299,
      499,
      40,
      #jewellery(#rings),
      true,
    ),
    createProduct(
      7,
      "Salwar Suit - Pink Georgette",
      "Georgette salwar suit in pink with intricate lacework. Comes with dupatta.",
      "/images/salwar1.jpg",
      "https://www.amazon.in/dp/B084R",
      999,
      1599,
      38,
      #fashion(#salwarSuits),
      false,
    ),
    createProduct(
      8,
      "Lehenga Choli - Navy Blue",
      "Stunning navy blue lehenga choli set with embroidery work. Includes matching dupatta.",
      "/images/lehenga1.jpg",
      "https://www.amazon.in/dp/B075J",
      1799,
      2799,
      36,
      #fashion(#lehengaCholis),
      true,
    ),
    createProduct(
      9,
      "Western Dress - A-Line",
      "Trendy A-line western dress in vibrant colors. Made from soft cotton fabric.",
      "/images/western1.jpg",
      "https://www.amazon.in/dp/B07TZ",
      599,
      999,
      40,
      #fashion(#westernWear),
      false,
    ),
    createProduct(
      10,
      "Sports Wear - Yoga Pants",
      "Comfortable stretch yoga pants perfect for fitness activities. Moisture-wicking fabric.",
      "/images/sports1.jpg",
      "https://www.amazon.in/dp/B07ZP",
      499,
      799,
      38,
      #fashion(#sportsWear),
      false,
    ),
    createProduct(
      11,
      "Silver-plated Necklace Set",
      "Elegant silver-plated necklace set with pearl embellishments. Suitable for formal events.",
      "/images/necklace2.jpg",
      "https://www.amazon.in/dp/B07XG",
      699,
      1099,
      36,
      #jewellery(#necklaces),
      true,
    ),
    createProduct(
      12,
      "Ring - Rose Gold Finish",
      "Chic rose gold finish ring with cubic zirconia stone. Adjustable size.",
      "/images/ring2.jpg",
      "https://www.amazon.in/dp/B07QK",
      399,
      599,
      33,
      #jewellery(#rings),
      false,
    ),
  ];

  for (product in seedProducts.values()) {
    products.add(product.id, product);
  };

  //////////////////////////////////////////////////
  // Authentication Methods
  //////////////////////////////////////////////////

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async ?Text {
    if (
      Text.equal(username, admin.username) and Text.equal(password, admin.password)
    ) {
      ?adminToken;
    } else {
      null;
    };
  };

  public shared ({ caller }) func validateAdminToken(token : Text) : async Bool {
    Text.equal(token, adminToken);
  };

  public shared ({ caller }) func changeAdminCredentials(token : Text, newUsername : Text, newPassword : Text) : async Bool {
    if (not Text.equal(token, adminToken)) {
      false;
    } else {
      admin := {
        username = newUsername;
        password = newPassword;
      };
      adminToken := newUsername # "-recomnow-secret-2024";
      true;
    };
  };

  //////////////////////////////////////////////////
  // Product CRUD
  //////////////////////////////////////////////////

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func addProduct(
    token : Text,
    title : Text,
    description : Text,
    imageUrl : Text,
    affiliateLink : Text,
    price : Nat,
    mrp : Nat,
    discountPercentage : Nat,
    category : Category,
    isFeatured : Bool,
  ) : async Product {
    if (not Text.equal(token, adminToken)) {
      Runtime.trap("Invalid admin token");
    };

    let product : Product = {
      id = nextId;
      title;
      description;
      imageUrl;
      affiliateLink;
      price;
      mrp;
      discountPercentage;
      category;
      isFeatured;
    };
    products.add(nextId, product);
    nextId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(
    token : Text,
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : Text,
    affiliateLink : Text,
    price : Nat,
    mrp : Nat,
    discountPercentage : Nat,
    category : Category,
    isFeatured : Bool,
  ) : async Product {
    if (not Text.equal(token, adminToken)) {
      Runtime.trap("Invalid admin token");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          title;
          description;
          imageUrl;
          affiliateLink;
          price;
          mrp;
          discountPercentage;
          category;
          isFeatured;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(token : Text, id : Nat) : async () {
    if (not Text.equal(token, adminToken)) {
      Runtime.trap("Invalid admin token");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };
};
