/**
 * SEVER Token JavaScript Functions
 * Handles MetaMask integration and token interactions
 */

// Token configuration
const SEVER_TOKEN = {
  address: '0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1',
  symbol: 'SEVER',
  decimals: 18,
  image: 'https://sever.network/favicon-lettermark.svg' // Update with actual logo URL
};

// Polygon network configuration
const POLYGON_NETWORK = {
  chainId: '0x89', // 137 in hex
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/']
};

/**
 * Add SEVER token to MetaMask
 */
async function addTokenToMetaMask() {
  // Check if MetaMask is installed
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install MetaMask to add the SEVER token.');
    window.open('https://metamask.io/download/', '_blank');
    return;
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if we're on Polygon network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    if (chainId !== POLYGON_NETWORK.chainId) {
      // Try to switch to Polygon network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: POLYGON_NETWORK.chainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [POLYGON_NETWORK],
            });
          } catch (addError) {
            console.error('Error adding Polygon network:', addError);
            alert('Failed to add Polygon network to MetaMask. Please add it manually.');
            return;
          }
        } else {
          console.error('Error switching to Polygon network:', switchError);
          alert('Failed to switch to Polygon network. Please switch manually.');
          return;
        }
      }
    }

    // Add the token
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: SEVER_TOKEN.address,
          symbol: SEVER_TOKEN.symbol,
          decimals: SEVER_TOKEN.decimals,
          image: SEVER_TOKEN.image,
        },
      },
    });

    if (wasAdded) {
      // Show success message
      showNotification('SEVER token has been added to MetaMask!', 'success');
    } else {
      showNotification('SEVER token was not added to MetaMask.', 'info');
    }
  } catch (error) {
    console.error('Error adding token to MetaMask:', error);
    showNotification('Error adding token to MetaMask. Please try again.', 'error');
  }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `token-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' : type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)'};
    border: 1px solid ${type === 'success' ? '#0f0' : type === 'error' ? '#f00' : '#0ff'};
    border-radius: 8px;
    color: ${type === 'success' ? '#0f0' : type === 'error' ? '#f00' : '#0ff'};
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .notification-content i {
    font-size: 1.2rem;
  }
`;
document.head.appendChild(style);

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Address copied to clipboard!', 'success');
  }).catch(err => {
    console.error('Failed to copy:', err);
    showNotification('Failed to copy address.', 'error');
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers to all copy buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const codeElement = this.previousElementSibling;
      if (codeElement && codeElement.tagName === 'CODE') {
        copyToClipboard(codeElement.textContent);
      }
    });
  });

  // Log MetaMask availability
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is available');
  } else {
    console.log('MetaMask is not installed');
  }
});

// Make function available globally
window.addTokenToMetaMask = addTokenToMetaMask;
