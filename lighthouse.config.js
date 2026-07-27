module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/category/fashion',
      ],
      numberOfSamples: 3,
    },
    assert: {
      assert: [
        'performance-score >= 45',
        'first-contentful-paint < 1.5s',
        'largest-contentful-paint < 8s',
        'cumulative-layout-shift < 0.1',
      ],
      error: ['performance-score < 30'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};