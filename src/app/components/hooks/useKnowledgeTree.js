// Fixed useKnowledgeTree.js
import { useState, useEffect, useCallback } from 'react';

export const useKnowledgeTree = () => {
  const [centralTopic, setCentralTopic] = useState('');
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['center']));
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ explored: 0, total: 0 });

  // Enhanced API call to generate questions
  const generateQuestions = async (topic, parentNode = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API response since we don't have a real backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const mockQuestions = [
        `What are the fundamental principles of ${topic}?`,
        `How can ${topic} be applied in practice?`,
        `What are the advanced concepts in ${topic}?`
      ];
      
      const newNodes = mockQuestions.map((question, index) => ({
        id: `node_${Date.now()}_${index}`,
        question,
        level: parentNode ? parentNode.level + 1 : 1,
        parentId: parentNode?.id || null,
        createdAt: new Date().toISOString(),
        expanded: false,
        category: index === 0 ? 'fundamental' : index === 1 ? 'practical' : 'advanced',
        progress: 0
      }));
      
      setProgress(prev => ({
        explored: prev.explored,
        total: prev.total + newNodes.length
      }));
      
      return newNodes;
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Neural circuit generation failed. Please reinitialize.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Enhanced API call to generate answer
  const generateAnswer = async (question) => {
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        answer: `🧠 Neural Circuit Analysis: "${question}"

This neural pathway represents a complex interconnected system of knowledge nodes that form the foundation for comprehensive understanding. Through advanced AI processing, we can identify key pattern relationships and cognitive frameworks that enable deeper learning.

⚡ Circuit Processing Overview:
The subject matter involves sophisticated interactions between theoretical foundations and practical implementations. Current neural pathways continue to evolve, with emerging research providing innovative perspectives and breakthrough methodologies.

🔬 Fundamental Analysis:
Understanding these core concepts enables enhanced decision-making capabilities and more efficient problem-solving algorithms. The implications extend beyond immediate applications to influence long-term strategic thinking and future developments.

🌐 Network Interconnections:
Contemporary research emphasizes the importance of interdisciplinary neural pathways, where insights from multiple knowledge domains contribute to holistic understanding. This convergence creates opportunities for breakthrough innovations and novel solutions.

🚀 Advanced Applications:
The practical implementation of these concepts demonstrates the real-world value of theoretical knowledge, bridging the gap between abstract understanding and tangible results.`,
        
        keyPoints: [
          'Neural pathway analysis reveals complex pattern relationships in the knowledge domain',
          'Foundational circuits provide the framework for advanced cognitive processing',
          'Current research continues to expand understanding through innovative methodologies',
          'Interdisciplinary approaches enhance problem-solving and analytical capabilities',
          'Future developments depend on understanding these core neural networks',
          'Real-world applications demonstrate the practical value of theoretical frameworks'
        ],
        
        references: [
          {
            title: 'Advanced Neural Framework Analysis and Applications',
            author: 'Institute for Cognitive Research',
            type: 'research',
            year: '2024'
          },
          {
            title: 'Contemporary Developments in Knowledge Networks',
            author: 'Academic Neural Consortium',
            type: 'journal',
            year: '2024'
          },
          {
            title: 'Practical Implementation of Neural Pathways',
            author: 'Cognitive Standards Organization',
            type: 'guide',
            year: '2024'
          }
        ],
        
        relatedQuestions: [
          `What are the key challenges in implementing ${question.toLowerCase().replace('?', '')} neural circuits?`,
          `How do current trends affect ${question.toLowerCase().replace('?', '')} pathway development?`,
          `What future neural innovations are expected in this domain?`
        ]
      };
    } catch (error) {
      console.error('Error generating answer:', error);
      return {
        answer: 'Neural circuit analysis temporarily unavailable. Please try again.',
        keyPoints: [],
        references: [],
        relatedQuestions: []
      };
    }
  };

  // Build tree structure
  const buildTreeStructure = useCallback(() => {
    if (!centralTopic) {
      setTreeData(null);
      return;
    }

    const tree = {
      id: 'center',
      question: centralTopic,
      level: 0,
      children: [],
      isRoot: true,
      category: 'root',
      progress: nodes.length > 0 ? 100 : 0
    };

    const nodesByParent = nodes.reduce((acc, node) => {
      const parentId = node.parentId || 'center';
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(node);
      return acc;
    }, {});

    const buildSubtree = (parentNode) => {
      const children = nodesByParent[parentNode.id] || [];
      parentNode.children = children.map(child => ({
        ...child,
        children: []
      }));
      
      parentNode.children.forEach(child => {
        buildSubtree(child);
      });
    };

    buildSubtree(tree);
    setTreeData(tree);
  }, [centralTopic, nodes]);

  useEffect(() => {
    buildTreeStructure();
  }, [buildTreeStructure]);

  // Enhanced topic submission
  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!centralTopic.trim()) return;
    
    setNodes([]);
    setSelectedNode(null);
    setExpandedNodes(new Set(['center']));
    setError(null);
    setProgress({ explored: 0, total: 0 });
    
    const newNodes = await generateQuestions(centralTopic);
    setNodes(newNodes);
  };

  // Enhanced node click with progress tracking
  const handleNodeClick = async (node) => {
    if (node.isRoot || node.loading) return;

    setNodes(prev => prev.map(n => 
      n.id === node.id ? { ...n, loading: true, progress: 50 } : n
    ));
    
    setSelectedNode({ ...node, loading: true });

    if (!node.answer) {
      const answer = await generateAnswer(node.question);
      
      setNodes(prev => prev.map(n => 
        n.id === node.id ? { ...n, answer, loading: false, progress: 100 } : n
      ));
      
      setSelectedNode({ ...node, answer, loading: false });
      
      setProgress(prev => ({
        ...prev,
        explored: prev.explored + 1
      }));
    } else {
      setSelectedNode({ ...node, loading: false });
      setNodes(prev => prev.map(n => 
        n.id === node.id ? { ...n, loading: false } : n
      ));
    }
  };

  // Enhanced node expansion
  const handleNodeExpand = async (node) => {
    const newQuestions = await generateQuestions(node.question, node);
    setNodes(prev => [...prev, ...newQuestions]);
    setExpandedNodes(prev => new Set([...prev, node.id]));
  };

  // Toggle functions
  const toggleExpanded = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return {
    centralTopic,
    setCentralTopic,
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    expandedNodes,
    setExpandedNodes,
    treeData,
    error,
    setError,
    progress,
    loading,
    generateQuestions,
    generateAnswer,
    handleTopicSubmit,
    handleNodeClick,
    handleNodeExpand,
    toggleExpanded,
  };
};