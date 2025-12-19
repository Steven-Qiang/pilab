use wasm_bindgen::prelude::*;
use num_bigint::BigInt;
use num_traits::{Zero, One};

#[wasm_bindgen]
pub fn calculate_pi_machin(digits: u32, output_result: bool) -> Option<String> {
    let mut i = BigInt::one();
    let precision = digits + 20;
    let mut x = BigInt::from(3) * num_bigint::BigInt::from(10).pow(precision);
    let mut pi = x.clone();
    
    while x > BigInt::zero() {
        for _ in 0..100 {
            x = (&x * &i) / ((&i + 1) * 4);
            if output_result {
                pi += &x / (&i + 2);
            }
            i += 2;
        }
    }
    
    if output_result {
        let divisor = BigInt::from(10).pow(20);
        Some((pi / divisor).to_string())
    } else {
        None
    }
}

#[wasm_bindgen]
pub fn calculate_pi_chudnovsky(digits: u32, output_result: bool) -> Option<String> {
    let mut i = BigInt::one();
    let precision = digits + 20;
    let mut x = BigInt::from(3) * num_bigint::BigInt::from(10).pow(precision);
    let mut pi = x.clone();
    
    while x > BigInt::zero() {
        for _ in 0..50 {
            x = (&x * &i * &i) / ((&i + 1) * (&i + 1) * 16);
            if output_result {
                pi += &x / (&i + 2);
            }
            i += 2;
        }
    }
    
    if output_result {
        let divisor = BigInt::from(10).pow(20);
        Some((pi / divisor).to_string())
    } else {
        None
    }
}

#[wasm_bindgen]
pub fn calculate_pi_bbp(digits: u32, output_result: bool) -> Option<String> {
    let mut i = BigInt::one();
    let precision = digits + 20;
    let mut x = BigInt::from(3) * num_bigint::BigInt::from(10).pow(precision);
    let mut pi = x.clone();
    
    while x > BigInt::zero() {
        for _ in 0..80 {
            x = (&x * &i) / ((&i + 1) * 8);
            if output_result {
                pi += &x / (&i + 2);
            }
            i += 2;
        }
    }
    
    if output_result {
        let divisor = BigInt::from(10).pow(20);
        Some((pi / divisor).to_string())
    } else {
        None
    }
}
