# tests/test_data_preprocessing.py

import unittest
import pandas as pd
from src.data_preprocessing import load_data, clean_data, preprocess_data

class TestDataPreprocessing(unittest.TestCase):

    def setUp(self):
        # Sample data for testing
        self.data = pd.DataFrame({
            'feature1': [1, 2, None, 4],
            'feature2': ['A', 'B', 'A', 'B'],
            'price': [100, 200, 150, 300]
        })

    def test_load_data(self):
        # Test loading data from a CSV file
        self.data.to_csv('test_data.csv', index=False)
        loaded_data = load_data('test_data.csv')
        pd.testing.assert_frame_equal(loaded_data, self.data)

    def test_clean_data(self):
        # Test cleaning data
        cleaned_data = clean_data(self.data)
        self.assertFalse(cleaned_data.isnull().values.any())
        self.assertEqual(cleaned_data.shape[0], 4)  # No rows should be dropped

    def test_preprocess_data(self):
        # Test preprocessing data
        X, y = preprocess_data('test_data.csv')
        self.assertEqual(X.shape[0], 4)  # Should have 4 rows
        self.assertEqual(y.shape[0], 4)  # Should have 4 rows
        self.assertIn('feature1', X.columns)  # Check if feature1 is in the features

if __name__ == '__main__':
    unittest.main()
