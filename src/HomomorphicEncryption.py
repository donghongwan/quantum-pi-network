import seal

class HomomorphicEncryption:
    def __init__(self):
        # Initialize encryption parameters
        self.parms = seal.EncryptionParameters(seal.scheme_type.BFV)
        self.parms.set_poly_modulus_degree(4096)
        self.parms.set_coeff_modulus(seal.CoeffModulus.BFVDefault(4096))
        self.parms.set_plain_modulus(seal.PlainModulus.Batching(4096, 20))

        self.context = seal.SEALContext.Create(self.parms)
        self.keygen = seal.KeyGenerator(self.context)
        self.public_key = self.keygen.public_key()
        self.secret_key = self.keygen.secret_key()
        self.encryptor = seal.Encryptor(self.context, self.public_key)
        self.decryptor = seal.Decryptor(self.context, self.secret_key)
        self.encoder = seal.BatchEncoder(self.context)

    def encrypt_data(self, data):
        """Encrypts the given data using homomorphic encryption."""
        # Ensure data is a list of integers
        if not isinstance(data, list) or not all(isinstance(x, int) for x in data):
            raise ValueError("Data must be a list of integers.")

        # Encrypt the data
        plain_data = seal.Plaintext()
        self.encoder.encode(data, plain_data)
        encrypted_data = seal.Ciphertext()
        self.encryptor.encrypt(plain_data, encrypted_data)

        return encrypted_data

    def decrypt_data(self, encrypted_data):
        """Decrypts the given encrypted data."""
        plain_data = seal.Plaintext()
        self.decryptor.decrypt(encrypted_data, plain_data)

        # Decode the plaintext back to the original data
        decoded_data = []
        self.encoder.decode(plain_data, decoded_data)
        return decoded_data

# Example usage
if __name__ == "__main__":
    he = HomomorphicEncryption()
    
    # Sample data to encrypt
    data_to_encrypt = [1, 2, 3, 4, 5]
    
    # Encrypt the data
    encrypted_data = he.encrypt_data(data_to_encrypt)
    print("Encrypted data:", encrypted_data)

    # Decrypt the data
    decrypted_data = he.decrypt_data(encrypted_data)
    print("Decrypted data:", decrypted_data)
