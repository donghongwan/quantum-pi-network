# tests/test_model.py

import unittest
import numpy as np
from src.model import build_model, train_model, evaluate_model

class TestModel(unittest.TestCase):

    def setUp(self):
        # Sample data for testing
        self.X_train = np.random.rand(100, 5)  # 100 samples, 5 features
        self.y_train = np.random.rand(100) * 100  # 100 target values
        self.X_val = np.random.rand(20, 5)  # 20 validation samples
        self.y_val = np.random.rand(20) * 100  # 20 validation target values

    def test_build_model(self):
        # Test building the model
        model = build_model(input_shape=self.X_train.shape[1])
        self.assertEqual(len(model.layers), 4)  # Check number of layers

    def test_train_model(self):
        # Test training the model
        model, history = train_model(self.X_train, self.y_train, self.X_val, self.y_val, epochs=1)
        self.assertIsNotNone(model)  # Ensure model is returned
        self.assertGreater(len(history.history['loss']), 0)  # Ensure loss history is recorded

    def test_evaluate_model(self):
        # Test evaluating the model
        model = build_model(input_shape=self.X_train.shape[1])
        model.fit(self.X_train, self.y_train, epochs=1, verbose=0)  # Train briefly
        mse, mae = evaluate_model(model, self.X_val, self.y_val)
        self.assertIsInstance(mse, float)  # Ensure MSE is a float
        self.assertIsInstance(mae, float)  # Ensure MAE is a float

if __name__ == '__main__':
    unittest.main()
