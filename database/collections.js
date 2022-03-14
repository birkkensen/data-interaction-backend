import db from "./mongodb.js";
export const cart = db().collection("cart");
export const orders = db().collection("orders");
export const products = db().collection("products");
export const warehouse = db().collection("warehouse");
