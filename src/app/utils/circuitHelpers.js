export const circuitHelpers = {
  generateNodeId: () => `neural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  calculateNodeLevel: (parentLevel = 0) => parentLevel + 1,
  
  determineNodeCategory: (index, totalNodes) => {
    const ratio = index / totalNodes;
    if (ratio < 0.33) return 'fundamental';
    if (ratio < 0.66) return 'practical';
    return 'advanced';
  },
  
  getCategoryTheme: (category) => {
    const themes = {
      root: {
        colors: 'from-blue-600 via-purple-600 to-cyan-600',
        icon: '🎯',
        name: 'Neural Core'
      },
      fundamental: {
        colors: 'from-emerald-500 to-teal-500',
        icon: '🔬',
        name: 'Foundation Circuit'
      },
      practical: {
        colors: 'from-orange-500 to-red-500',
        icon: '⚙️',
        name: 'Application Circuit'
      },
      advanced: {
        colors: 'from-purple-500 to-pink-500',
        icon: '🚀',
        name: 'Advanced Circuit'
      }
    };
    
    return themes[category] || themes.fundamental;
  },
  
  formatProgress: (current, total) => {
    if (total === 0) return { percentage: 0, status: 'inactive' };
    const percentage = Math.round((current / total) * 100);
    let status = 'active';
    if (percentage === 100) status = 'complete';
    if (percentage === 0) status = 'pending';
    return { percentage, status };
  },
  
  generateCircuitPath: (nodes) => {
    return nodes.map(node => ({
      ...node,
      circuitId: `circuit_${node.id}`,
      neuralWeight: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
      connectionStrength: Math.random() * 100,
      processingLoad: Math.random() * 50 + 25 // 25% to 75%
    }));
  },
  
  validateCircuitIntegrity: (treeData) => {
    if (!treeData) return { valid: false, errors: ['No circuit data'] };
    
    const errors = [];
    const nodeIds = new Set();
    
    const validateNode = (node, depth = 0) => {
      if (!node.id) errors.push(`Node at depth ${depth} missing ID`);
      if (nodeIds.has(node.id)) errors.push(`Duplicate node ID: ${node.id}`);
      nodeIds.add(node.id);
      
      if (!node.question) errors.push(`Node ${node.id} missing question`);
      if (typeof node.level !== 'number') errors.push(`Node ${node.id} invalid level`);
      
      if (node.children) {
        node.children.forEach(child => validateNode(child, depth + 1));
      }
    };
    
    validateNode(treeData);
    return { valid: errors.length === 0, errors };
  }
};
