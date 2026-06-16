import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
  type NodeProps,
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'

type NodeType = 'root' | 'layer' | 'category' | 'role'

interface CareerNode {
  id: string
  name: string
  type: NodeType
  tag: string
  icon?: string
  color?: string
  children?: CareerNode[]
}

const treeData: CareerNode = {
  id: 'root',
  name: 'KNOWLEDGE',
  type: 'root',
  tag: './',
  icon: 'sprout',
  color: '#78716c',
  children: [
    {
      id: 'layer-1',
      name: 'Root Knowledge',
      type: 'layer',
      tag: '{}',
      icon: 'compass',
      color: '#9a8fc0',
      children: [
        {
          id: 'cat-1-1',
          name: 'Mathematics',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-1-1-1', name: 'Pure Mathematician', type: 'role', tag: '' },
            { id: 'role-1-1-2', name: 'Applied Mathematician', type: 'role', tag: '' },
            { id: 'role-1-1-3', name: 'Statistician', type: 'role', tag: '' },
            { id: 'role-1-1-4', name: 'Operations Research Analyst', type: 'role', tag: '' },
            { id: 'role-1-1-5', name: 'Cryptographer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-1-2',
          name: 'Physics',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-1-2-1', name: 'Theoretical Physicist', type: 'role', tag: '' },
            { id: 'role-1-2-2', name: 'Experimental Physicist', type: 'role', tag: '' },
            { id: 'role-1-2-3', name: 'Optical Physicist', type: 'role', tag: '' },
            { id: 'role-1-2-4', name: 'Materials Physicist', type: 'role', tag: '' },
            { id: 'role-1-2-5', name: 'Plasma / Quantum / Nuclear Physicist', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-1-3',
          name: 'Chemistry',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-1-3-1', name: 'Chemist', type: 'role', tag: '' },
            { id: 'role-1-3-2', name: 'Analytical Chemist', type: 'role', tag: '' },
            { id: 'role-1-3-3', name: 'Organic Chemist', type: 'role', tag: '' },
            { id: 'role-1-3-4', name: 'Physical Chemist', type: 'role', tag: '' },
            { id: 'role-1-3-5', name: 'Industrial Chemist', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-1-4',
          name: 'Biology',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-1-4-1', name: 'Biologist', type: 'role', tag: '' },
            { id: 'role-1-4-2', name: 'Geneticist', type: 'role', tag: '' },
            { id: 'role-1-4-3', name: 'Microbiologist', type: 'role', tag: '' },
            { id: 'role-1-4-4', name: 'Neuroscientist', type: 'role', tag: '' },
            { id: 'role-1-4-5', name: 'Biomedical Researcher', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-1-5',
          name: 'Social Sciences',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-1-5-1', name: 'Economist', type: 'role', tag: '' },
            { id: 'role-1-5-2', name: 'Sociologist', type: 'role', tag: '' },
            { id: 'role-1-5-3', name: 'Psychologist', type: 'role', tag: '' },
            { id: 'role-1-5-4', name: 'Anthropologist', type: 'role', tag: '' },
            { id: 'role-1-5-5', name: 'Political Scientist', type: 'role', tag: '' },
            { id: 'role-1-5-6', name: 'Behavioral Scientist', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-2',
      name: 'Discovery Layer',
      type: 'layer',
      tag: '{}',
      icon: 'microscope',
      color: '#7f9cc4',
      children: [
        { id: 'role-2-1', name: 'Academic Researcher', type: 'role', tag: '' },
        { id: 'role-2-2', name: 'Research Scientist', type: 'role', tag: '' },
        { id: 'role-2-3', name: 'Laboratory Scientist', type: 'role', tag: '' },
        { id: 'role-2-4', name: 'Research Engineer', type: 'role', tag: '' },
        { id: 'role-2-5', name: 'Applied Scientist', type: 'role', tag: '' },
        { id: 'role-2-6', name: 'R&D Engineer', type: 'role', tag: '' },
      ],
    },
    {
      id: 'layer-3',
      name: 'Core Engineering Layer',
      type: 'layer',
      tag: '{}',
      icon: 'wrench',
      color: '#6faab0',
      children: [
        {
          id: 'cat-3-1',
          name: 'Mechanical Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-1-1', name: 'Mechanical Design Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-2', name: 'Manufacturing Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-3', name: 'Thermal Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-4', name: 'Automotive Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-5', name: 'Aerospace Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-6', name: 'Robotics Mechanical Engineer', type: 'role', tag: '' },
            { id: 'role-3-1-7', name: 'Mechatronics Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-3-2',
          name: 'Electrical Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-2-1', name: 'Electrical Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-2', name: 'Electronics Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-3', name: 'Power Systems Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-4', name: 'Control Systems Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-5', name: 'Signal Processing Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-6', name: 'RF Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-7', name: 'Telecommunications Engineer', type: 'role', tag: '' },
            { id: 'role-3-2-8', name: 'Embedded Hardware Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-3-3',
          name: 'Chemical Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-3-1', name: 'Chemical Process Engineer', type: 'role', tag: '' },
            { id: 'role-3-3-2', name: 'Petroleum Engineer', type: 'role', tag: '' },
            { id: 'role-3-3-3', name: 'Pharmaceutical Process Engineer', type: 'role', tag: '' },
            { id: 'role-3-3-4', name: 'Battery Process Engineer', type: 'role', tag: '' },
            { id: 'role-3-3-5', name: 'Food Process Engineer', type: 'role', tag: '' },
            { id: 'role-3-3-6', name: 'Environmental Process Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-3-4',
          name: 'Materials Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-4-1', name: 'Materials Engineer', type: 'role', tag: '' },
            { id: 'role-3-4-2', name: 'Metallurgical Engineer', type: 'role', tag: '' },
            { id: 'role-3-4-3', name: 'Semiconductor Materials Engineer', type: 'role', tag: '' },
            { id: 'role-3-4-4', name: 'Polymer Engineer', type: 'role', tag: '' },
            { id: 'role-3-4-5', name: 'Composite Materials Engineer', type: 'role', tag: '' },
            { id: 'role-3-4-6', name: 'Failure Analysis Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-3-5',
          name: 'Civil Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-5-1', name: 'Structural Engineer', type: 'role', tag: '' },
            { id: 'role-3-5-2', name: 'Transportation Engineer', type: 'role', tag: '' },
            { id: 'role-3-5-3', name: 'Geotechnical Engineer', type: 'role', tag: '' },
            { id: 'role-3-5-4', name: 'Water Resources Engineer', type: 'role', tag: '' },
            { id: 'role-3-5-5', name: 'Construction Engineer', type: 'role', tag: '' },
            { id: 'role-3-5-6', name: 'Urban Infrastructure Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-3-6',
          name: 'Biomedical Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-3-6-1', name: 'Biomedical Engineer', type: 'role', tag: '' },
            { id: 'role-3-6-2', name: 'Medical Device Engineer', type: 'role', tag: '' },
            { id: 'role-3-6-3', name: 'Biomechanics Engineer', type: 'role', tag: '' },
            { id: 'role-3-6-4', name: 'Bioinstrumentation Engineer', type: 'role', tag: '' },
            { id: 'role-3-6-5', name: 'Neural Engineer', type: 'role', tag: '' },
            { id: 'role-3-6-6', name: 'Rehabilitation Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-4',
      name: 'Computing Hardware Layer',
      type: 'layer',
      tag: '{}',
      icon: 'cpu',
      color: '#74ab95',
      children: [
        {
          id: 'cat-4-1',
          name: 'Computer Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-4-1-1', name: 'Computer Hardware Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-2', name: 'Computer Architecture Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-3', name: 'FPGA Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-4', name: 'Firmware Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-5', name: 'Embedded Systems Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-6', name: 'IoT Engineer', type: 'role', tag: '' },
            { id: 'role-4-1-7', name: 'Edge Computing Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-4-2',
          name: 'Semiconductor Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-4-2-1', name: 'Chip Design Engineer', type: 'role', tag: '' },
            { id: 'role-4-2-2', name: 'Verification Engineer', type: 'role', tag: '' },
            { id: 'role-4-2-3', name: 'ASIC Engineer', type: 'role', tag: '' },
            { id: 'role-4-2-4', name: 'VLSI Engineer', type: 'role', tag: '' },
            { id: 'role-4-2-5', name: 'Physical Design Engineer', type: 'role', tag: '' },
            { id: 'role-4-2-6', name: 'Semiconductor Process Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-4-3',
          name: 'Network Hardware',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-4-3-1', name: 'Network Engineer', type: 'role', tag: '' },
            { id: 'role-4-3-2', name: 'RF Systems Engineer', type: 'role', tag: '' },
            { id: 'role-4-3-3', name: 'Telecom Systems Engineer', type: 'role', tag: '' },
            { id: 'role-4-3-4', name: 'Wireless Communications Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-5',
      name: 'Computer Science & Systems Layer',
      type: 'layer',
      tag: '{}',
      icon: 'binary',
      color: '#9aac72',
      children: [
        {
          id: 'cat-5-1',
          name: 'Computer Science',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-5-1-1', name: 'Computer Scientist', type: 'role', tag: '' },
            { id: 'role-5-1-2', name: 'Algorithms Engineer', type: 'role', tag: '' },
            { id: 'role-5-1-3', name: 'Programming Language Researcher', type: 'role', tag: '' },
            { id: 'role-5-1-4', name: 'Distributed Systems Engineer', type: 'role', tag: '' },
            { id: 'role-5-1-5', name: 'Database Researcher', type: 'role', tag: '' },
            { id: 'role-5-1-6', name: 'Cryptography Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-5-2',
          name: 'Systems Software',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-5-2-1', name: 'Operating Systems Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-2', name: 'Kernel Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-3', name: 'Compiler Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-4', name: 'Runtime Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-5', name: 'Database Engine Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-6', name: 'Storage Systems Engineer', type: 'role', tag: '' },
            { id: 'role-5-2-7', name: 'Networking Systems Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-5-3',
          name: 'Cybersecurity',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-5-3-1', name: 'Security Engineer', type: 'role', tag: '' },
            { id: 'role-5-3-2', name: 'Application Security Engineer', type: 'role', tag: '' },
            { id: 'role-5-3-3', name: 'Cloud Security Engineer', type: 'role', tag: '' },
            { id: 'role-5-3-4', name: 'Security Researcher', type: 'role', tag: '' },
            { id: 'role-5-3-5', name: 'Malware Analyst', type: 'role', tag: '' },
            { id: 'role-5-3-6', name: 'Cryptography Engineer', type: 'role', tag: '' },
            { id: 'role-5-3-7', name: 'Incident Response Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-6',
      name: 'Software Product Layer',
      type: 'layer',
      tag: '{}',
      icon: 'layout',
      color: '#c7a866',
      children: [
        {
          id: 'cat-6-1',
          name: 'Software Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-6-1-1', name: 'Software Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-2', name: 'Backend Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-3', name: 'Frontend Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-4', name: 'Full Stack Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-5', name: 'Mobile Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-6', name: 'Desktop Application Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-7', name: 'API Engineer', type: 'role', tag: '' },
            { id: 'role-6-1-8', name: 'QA / Test Automation Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-6-2',
          name: 'Product Infrastructure',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-6-2-1', name: 'Cloud Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-2', name: 'DevOps Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-3', name: 'Platform Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-4', name: 'Site Reliability Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-5', name: 'Infrastructure Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-6', name: 'Developer Experience Engineer', type: 'role', tag: '' },
            { id: 'role-6-2-7', name: 'Build & Release Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-6-3',
          name: 'Product and UX',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-6-3-1', name: 'Product Engineer', type: 'role', tag: '' },
            { id: 'role-6-3-2', name: 'UX Engineer', type: 'role', tag: '' },
            { id: 'role-6-3-3', name: 'UI Engineer', type: 'role', tag: '' },
            { id: 'role-6-3-4', name: 'Design Systems Engineer', type: 'role', tag: '' },
            { id: 'role-6-3-5', name: 'Technical Product Manager', type: 'role', tag: '' },
            { id: 'role-6-3-6', name: 'Solutions Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-7',
      name: 'Data Layer',
      type: 'layer',
      tag: '{}',
      icon: 'database',
      color: '#c98a8a',
      children: [
        {
          id: 'cat-7-1',
          name: 'Data Infrastructure',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-7-1-1', name: 'Data Engineer', type: 'role', tag: '' },
            { id: 'role-7-1-2', name: 'Analytics Engineer', type: 'role', tag: '' },
            { id: 'role-7-1-3', name: 'Data Platform Engineer', type: 'role', tag: '' },
            { id: 'role-7-1-4', name: 'Database Administrator', type: 'role', tag: '' },
            { id: 'role-7-1-5', name: 'Data Warehouse Engineer', type: 'role', tag: '' },
            { id: 'role-7-1-6', name: 'Streaming Data Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-7-2',
          name: 'Data Understanding',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-7-2-1', name: 'Data Analyst', type: 'role', tag: '' },
            { id: 'role-7-2-2', name: 'Business Intelligence Analyst', type: 'role', tag: '' },
            { id: 'role-7-2-3', name: 'Product Analyst', type: 'role', tag: '' },
            { id: 'role-7-2-4', name: 'Quantitative Analyst', type: 'role', tag: '' },
            { id: 'role-7-2-5', name: 'Statistician', type: 'role', tag: '' },
            { id: 'role-7-2-6', name: 'Decision Scientist', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-7-3',
          name: 'Data Modeling',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-7-3-1', name: 'Data Scientist', type: 'role', tag: '' },
            { id: 'role-7-3-2', name: 'Machine Learning Scientist', type: 'role', tag: '' },
            { id: 'role-7-3-3', name: 'Econometrician', type: 'role', tag: '' },
            { id: 'role-7-3-4', name: 'Forecasting Scientist', type: 'role', tag: '' },
            { id: 'role-7-3-5', name: 'Computational Scientist', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-8',
      name: 'Machine Learning & AI Layer',
      type: 'layer',
      tag: '{}',
      icon: 'brain',
      color: '#c98ab0',
      children: [
        {
          id: 'cat-8-1',
          name: 'Machine Learning',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-8-1-1', name: 'Machine Learning Engineer', type: 'role', tag: '' },
            { id: 'role-8-1-2', name: 'Applied ML Engineer', type: 'role', tag: '' },
            { id: 'role-8-1-3', name: 'ML Research Engineer', type: 'role', tag: '' },
            { id: 'role-8-1-4', name: 'Recommendation Systems Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-8-2',
          name: 'AI Product Engineering',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-8-2-1', name: 'AI Engineer', type: 'role', tag: '' },
            { id: 'role-8-2-2', name: 'LLM Engineer', type: 'role', tag: '' },
            { id: 'role-8-2-3', name: 'AI Agents Engineer', type: 'role', tag: '' },
            { id: 'role-8-2-4', name: 'AI Product Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-8-3',
          name: 'AI Platform & Infrastructure',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-8-3-1', name: 'AI Infrastructure Engineer', type: 'role', tag: '' },
            { id: 'role-8-3-2', name: 'ML Platform Engineer', type: 'role', tag: '' },
            { id: 'role-8-3-3', name: 'GPU Infrastructure Engineer', type: 'role', tag: '' },
            { id: 'role-8-3-4', name: 'MLOps / LLMOps Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-8-4',
          name: 'AI Research',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-8-4-1', name: 'AI Research Scientist', type: 'role', tag: '' },
            { id: 'role-8-4-2', name: 'Deep Learning Researcher', type: 'role', tag: '' },
            { id: 'role-8-4-3', name: 'Generative AI Researcher', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-8-5',
          name: 'Forward-Deployed AI',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-8-5-1', name: 'Forward-Deployed AI Engineer', type: 'role', tag: '' },
            { id: 'role-8-5-2', name: 'AI Solutions Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
    {
      id: 'layer-9',
      name: 'Physical Intelligence Layer',
      type: 'layer',
      tag: '{}',
      icon: 'eye',
      color: '#8a90c4',
      children: [
        {
          id: 'cat-9-1',
          name: 'Computer Vision',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-9-1-1', name: 'Computer Vision Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-2', name: 'Perception Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-3', name: 'Video Analytics Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-4', name: 'OCR Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-5', name: '3D Vision Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-6', name: 'SLAM Engineer', type: 'role', tag: '' },
            { id: 'role-9-1-7', name: 'Sensor Fusion Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-9-2',
          name: 'Robotics',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-9-2-1', name: 'Robotics Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-2', name: 'Motion Planning Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-3', name: 'Controls Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-4', name: 'Localization Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-5', name: 'Manipulation Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-6', name: 'Autonomous Navigation Engineer', type: 'role', tag: '' },
            { id: 'role-9-2-7', name: 'Human-Robot Interaction Engineer', type: 'role', tag: '' },
          ],
        },
        {
          id: 'cat-9-3',
          name: 'Autonomous Systems',
          type: 'category',
          tag: '{}',
          children: [
            { id: 'role-9-3-1', name: 'Autonomous Vehicle Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-2', name: 'Drone Software Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-3', name: 'Flight Controls Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-4', name: 'Autonomy Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-5', name: 'Simulation Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-6', name: 'Safety Engineer', type: 'role', tag: '' },
            { id: 'role-9-3-7', name: 'Field Robotics Engineer', type: 'role', tag: '' },
          ],
        },
      ],
    },
  ],
}

const CROSS_LINKS: Array<{ source: string; target: string; color: string }> = [
  { source: 'cat-1-1', target: 'cat-5-1', color: '#7b8fc4' },
  { source: 'cat-1-2', target: 'cat-4-2', color: '#5aa8c4' },
  { source: 'cat-1-4', target: 'cat-3-6', color: '#5dba88' },
  { source: 'cat-1-5', target: 'cat-6-3', color: '#c27d55' },
  { source: 'cat-1-5', target: 'cat-7-2', color: '#b06488' },
  { source: 'cat-1-5', target: 'cat-7-3', color: '#6a9f7a' },
  { source: 'cat-3-1', target: 'cat-9-2', color: '#e8925a' },
  { source: 'cat-3-2', target: 'cat-4-2', color: '#9970c2' },
  { source: 'cat-3-2', target: 'cat-4-1', color: '#c46f9e' },
  { source: 'cat-3-4', target: 'cat-4-2', color: '#60b8b8' },
  { source: 'cat-4-1', target: 'cat-9-2', color: '#c4a44a' },
  { source: 'cat-5-1', target: 'cat-8-1', color: '#e07070' },
  { source: 'cat-7-3', target: 'cat-8-1', color: '#7ab84e' },
]

const PARENT_OF = new Map<string, string>()
;(function buildParents(node: CareerNode, parent?: string) {
  if (parent) PARENT_OF.set(node.id, parent)
  node.children?.forEach((c) => buildParents(c, node.id))
})(treeData)

interface CardData {
  node: CareerNode
  hasChildren: boolean
  expanded: boolean
  matched: boolean
  linked: boolean
  dimmed: boolean
  blurred: boolean
  focused: boolean
  onToggle: (id: string, currentExpanded: boolean) => void
}

function getMutedColors(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }
  const hue = Math.abs(hash * 0.618033988749895 * 360) % 360
  return {
    bg: `hsl(${hue}, 45%, 97%)`,
    border: `hsl(${hue}, 40%, 88%)`,
    accent: `hsl(${hue}, 50%, 42%)`,
    text: `hsl(${hue}, 55%, 18%)`,
  }
}

const NODE_W = 250
const NODE_H = 44

function CareerCard({ data }: NodeProps<CardData>) {
  const { node, hasChildren, expanded, matched, linked, dimmed, blurred, focused, onToggle } = data
  const isRoot = node.type === 'root'
  const colors = useMemo(() => getMutedColors(node.id), [node.id])
  const accent = colors.accent

  return (
    <div
      onClick={() => hasChildren && onToggle(node.id, expanded)}
      className={`ct-card ${hasChildren ? 'ct-clickable' : ''} ${matched ? 'ct-matched' : ''} ${linked ? 'ct-linked' : ''} ${dimmed ? 'ct-dimmed' : ''} ${blurred ? 'ct-blurred' : ''} ${focused ? 'ct-focused' : ''}`}
      style={{
        width: NODE_W,
        background: colors.bg,
        borderColor: linked || focused ? accent : colors.border,
      }}>
      <Handle id="in" type="target" position={Position.Left} className="ct-handle" style={{ borderColor: accent }} />

      <span className="ct-label-wrap">
        {node.icon && (
          <span
            className={`i-lucide-${node.icon} ct-ic`}
            style={{ color: accent }}
          />
        )}
        <span
          className="ct-label"
          style={{
            fontWeight: isRoot ? 700 : node.type === 'layer' ? 600 : node.type === 'category' ? 500 : 400,
            color: colors.text,
          }}>
          {node.name}
        </span>
      </span>

      {hasChildren && (
        <span
          className={`i-lucide-chevron-down ct-chev ${expanded ? 'ct-open' : ''}`}
          style={{ color: accent }}
        />
      )}

      <Handle id="out" type="source" position={Position.Right} className="ct-handle" style={{ borderColor: accent }} />
      <Handle id="in-right" type="target" position={Position.Right} className="ct-handle ct-handle-hidden" style={{ borderColor: accent }} />
    </div>
  )
}

const nodeTypes = { career: CareerCard }

function buildGraph(
  expanded: Record<string, boolean>,
  query: string,
  onToggle: (id: string, currentExpanded: boolean) => void,
) {
  const nodes: Node<CardData>[] = []
  const treeEdges: Edge[] = []
  const crossEdges: Edge[] = []
  const q = query.trim().toLowerCase()
  const searchInfo = new Map<string, { selfMatch: boolean; subtreeMatch: boolean }>()

  if (q) {
    collectSearchInfo(treeData, q, searchInfo)
  }

  const walk = (node: CareerNode, parentId?: string) => {
    const hasChildren = !!node.children && node.children.length > 0
    const info = q ? searchInfo.get(node.id) || { selfMatch: false, subtreeMatch: false } : undefined
    const selfMatch = q ? !!info?.selfMatch : false
    const subtreeMatch = q ? !!info?.subtreeMatch : false

    const isRoot = node.id === treeData.id
    const hasExplicitState = Object.prototype.hasOwnProperty.call(expanded, node.id)
    const explicitOpen = hasExplicitState ? !!expanded[node.id] : false

    let isVisible = true
    if (q) {
      if (isRoot) {
        isVisible = true
      } else if (subtreeMatch) {
        isVisible = true
      } else if (parentId) {
        const parentExplicitlyOpen = Object.prototype.hasOwnProperty.call(expanded, parentId) && !!expanded[parentId]
        isVisible = parentExplicitlyOpen && (parentId !== treeData.id)
      } else {
        isVisible = false
      }
    }

    if (!isVisible) {
      return
    }

    let isExpanded = false
    if (hasExplicitState) {
      isExpanded = explicitOpen
    } else if (q) {
      isExpanded = isRoot || (!selfMatch && subtreeMatch)
    } else {
      isExpanded = false
    }

    nodes.push({
      id: node.id,
      type: 'career',
      position: { x: 0, y: 0 },
      data: {
        node,
        hasChildren,
        expanded: isExpanded,
        matched: selfMatch,
        linked: false,
        dimmed: false,
        blurred: false,
        focused: false,
        onToggle,
      },
    })

    if (parentId) {
      treeEdges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'default',
        style: { stroke: '#cfc8b6', strokeWidth: 1.5 },
      })
    }

    if (hasChildren && isExpanded) {
      node.children!.forEach((child) => walk(child, node.id))
    }
  }

  walk(treeData)

  const visibleIds = new Set(nodes.map((n) => n.id))
  CROSS_LINKS.forEach(({ source, target, color }) => {
    if (visibleIds.has(source) && visibleIds.has(target)) {
      crossEdges.push({
        id: `bridge-${source}-${target}`,
        source,
        target,
        sourceHandle: 'out',
        targetHandle: 'in-right',
        type: 'default',
        pathOptions: { curvature: 0.6 },
        animated: true,
        zIndex: 10,
        style: { stroke: color, strokeWidth: 2, opacity: 0.85 },
      })
    }
  })

  return { nodes, treeEdges, crossEdges }
}

const ARC_AMPLITUDE = 80

function layout(nodes: Node<CardData>[], treeEdges: Edge[], crossEdges: Edge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 18, ranksep: 150 })

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }))
  treeEdges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)

  const parentOf = new Map<string, string>()
  treeEdges.forEach((e) => parentOf.set(e.target, e.source))

  const siblingGroups = new Map<string, { id: string; y: number }[]>()
  nodes.forEach((n) => {
    const p = g.node(n.id)
    const parent = parentOf.get(n.id) ?? '__root__'
    if (!siblingGroups.has(parent)) siblingGroups.set(parent, [])
    siblingGroups.get(parent)!.push({ id: n.id, y: p.y })
  })

  const arcOffset = new Map<string, number>()
  siblingGroups.forEach((group) => {
    if (group.length < 3) {
      group.forEach((it) => arcOffset.set(it.id, 0))
      return
    }
    const ys = group.map((it) => it.y)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const mid = (minY + maxY) / 2
    const half = (maxY - minY) / 2 || 1
    group.forEach((it) => {
      const t = (it.y - mid) / half
      arcOffset.set(it.id, ARC_AMPLITUDE * (1 - t * t))
    })
  })

  nodes.forEach((n) => {
    const p = g.node(n.id)
    const offset = arcOffset.get(n.id) ?? 0
    n.position = { x: p.x - NODE_W / 2 + offset, y: p.y - NODE_H / 2 }
    n.targetPosition = Position.Left
    n.sourcePosition = Position.Right
  })

  return { nodes, treeEdges, crossEdges }
}

function collectSearchInfo(
  node: CareerNode,
  query: string,
  info: Map<string, { selfMatch: boolean; subtreeMatch: boolean }>,
) {
  const selfMatch = node.name.toLowerCase().includes(query)
  let subtreeMatch = selfMatch

  node.children?.forEach((child) => {
    if (collectSearchInfo(child, query, info)) {
      subtreeMatch = true
    }
  })

  info.set(node.id, { selfMatch, subtreeMatch })

  return subtreeMatch
}

function Flow() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
  })
  const [query, setQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const isFirstRender = useRef(true)
  const { fitView } = useReactFlow()

  const toggle = useCallback((id: string, currentExpanded: boolean) => {
    setExpanded((prev) => {
      const next = { ...prev, [id]: !currentExpanded }
      if (currentExpanded) {
        const descendants: string[] = []
        const findAndCollectDescendants = (n: CareerNode, active = false) => {
          const isTarget = n.id === id
          const collect = active || isTarget
          if (collect && !isTarget) {
            descendants.push(n.id)
          }
          n.children?.forEach((c) => findAndCollectDescendants(c, collect))
        }
        findAndCollectDescendants(treeData)
        descendants.forEach((dId) => {
          next[dId] = false
        })
      }
      return next
    })
  }, [])

  const layouted = useMemo(() => {
    const g = buildGraph(expanded, query, toggle)
    return layout(g.nodes, g.treeEdges, g.crossEdges)
  }, [expanded, query, toggle])

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.treeEdges)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    let animationFrameId: number
    const startTime = performance.now()
    const duration = 400

    const startPositions = new Map<string, { x: number; y: number }>()
    nodes.forEach((n) => {
      startPositions.set(n.id, n.position)
    })

    const targetPositions = new Map<string, { x: number; y: number }>()
    layouted.nodes.forEach((n) => {
      targetPositions.set(n.id, n.position)
    })

    const initialPositions = new Map<string, { x: number; y: number }>()
    layouted.nodes.forEach((n) => {
      if (startPositions.has(n.id)) {
        initialPositions.set(n.id, startPositions.get(n.id)!)
      } else {
        const parentEdge = layouted.treeEdges.find((e) => e.target === n.id)
        if (parentEdge) {
          const parentPos = startPositions.get(parentEdge.source) || targetPositions.get(parentEdge.source)
          if (parentPos) {
            initialPositions.set(n.id, { ...parentPos })
            return
          }
        }
        initialPositions.set(n.id, n.position)
      }
    })

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)

      setNodes((curr) => {
        const currDataMap = new Map<string, CardData>()
        curr.forEach((n) => {
          currDataMap.set(n.id, n.data)
        })

        return layouted.nodes.map((ln) => {
          const start = initialPositions.get(ln.id) || ln.position
          const target = ln.position
          const currentX = start.x + (target.x - start.x) * ease
          const currentY = start.y + (target.y - start.y) * ease
          const existingData = currDataMap.get(ln.id)
          return {
            ...ln,
            position: { x: currentX, y: currentY },
            data: {
              ...ln.data,
              linked: existingData?.linked ?? ln.data.linked,
              dimmed: existingData?.dimmed ?? ln.data.dimmed,
              blurred: existingData?.blurred ?? ln.data.blurred,
              focused: existingData?.focused ?? ln.data.focused,
            },
          }
        })
      })

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick)
      }
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrameId)
  }, [layouted, setNodes])

  const focusSet = useMemo(() => {
    if (!focusedId) return null
    const set = new Set<string>([focusedId])
    let p = PARENT_OF.get(focusedId)
    while (p) {
      set.add(p)
      p = PARENT_OF.get(p)
    }
    layouted.nodes.forEach((n) => {
      let a: string | undefined = n.id
      while (a) {
        if (a === focusedId) {
          set.add(n.id)
          break
        }
        a = PARENT_OF.get(a)
      }
    })
    layouted.crossEdges.forEach((e) => {
      if (e.source === focusedId) set.add(e.target)
      if (e.target === focusedId) set.add(e.source)
    })
    return set
  }, [focusedId, layouted])

  const peekId = focusedId ? null : hoveredId ?? selectedId

  const peekActive = useMemo(
    () =>
      !!peekId &&
      layouted.crossEdges.some(
        (e) => e.source === peekId || e.target === peekId,
      ),
    [peekId, layouted],
  )

  useEffect(() => {
    if (focusSet) {
      const treeVisible = layouted.treeEdges.map((e) => {
        const inFocus = focusSet.has(e.source) && focusSet.has(e.target)
        return inFocus ? e : { ...e, style: { ...e.style, opacity: 0.07 } }
      })
      const bridgeVisible = layouted.crossEdges.filter(
        (e) => e.source === focusedId || e.target === focusedId,
      )
      setEdges([...treeVisible, ...bridgeVisible])
      return
    }
    if (!peekActive) {
      setEdges(layouted.treeEdges)
      return
    }
    const active = layouted.crossEdges.filter(
      (e) => e.source === peekId || e.target === peekId,
    )
    setEdges([...layouted.treeEdges, ...active])
  }, [focusSet, focusedId, peekActive, peekId, layouted, setEdges])

  useEffect(() => {
    setNodes((curr) =>
      curr.map((n) => {
        let linked = false
        let dimmed = false
        let blurred = false
        let focused = false

        if (focusSet) {
          const inFocus = focusSet.has(n.id)
          focused = n.id === focusedId
          const isBridgeConnected = layouted.crossEdges.some(
            (e) =>
              (e.source === focusedId && e.target === n.id) ||
              (e.target === focusedId && e.source === n.id),
          )
          linked = focused || isBridgeConnected
          blurred = !inFocus
        } else if (peekActive) {
          const isPeek = n.id === peekId
          const isConnected = layouted.crossEdges.some(
            (e) =>
              (e.source === peekId && e.target === n.id) ||
              (e.target === peekId && e.source === n.id),
          )
          linked = isPeek || isConnected
          dimmed = !linked
        }

        const d = n.data
        if (
          d.linked === linked &&
          d.dimmed === dimmed &&
          d.blurred === blurred &&
          d.focused === focused
        ) {
          return n
        }
        return { ...n, data: { ...d, linked, dimmed, blurred, focused } }
      }),
    )
  }, [focusSet, focusedId, peekActive, peekId, layouted, setNodes])

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.18, duration: 400 }), 60)
    return () => clearTimeout(t)
  }, [layouted, fitView])

  return (
    <>
      <div className="ct-toolbar">
        <div className="ct-search">
          <span className="i-lucide-search ct-search-ic" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
          {query && (
            <button className="ct-clear" data-haptic="selection" onClick={() => setQuery('')}>
              <span className="i-lucide-x" />
            </button>
          )}
        </div>
      </div>

      <div className="ct-canvas" data-no-haptic>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
          onNodeMouseLeave={() => setHoveredId(null)}
          onNodeClick={(_, node) =>
            setSelectedId((cur) => (cur === node.id ? null : node.id))
          }
          onNodeDoubleClick={(_, node) =>
            setFocusedId((cur) => (cur === node.id ? null : node.id))
          }
          onPaneClick={() => {
            setFocusedId(null)
            setSelectedId(null)
          }}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elevateNodesOnSelect={false}>
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e0dac9" />
        </ReactFlow>
      </div>
    </>
  )
}

export default function CareerTreeBoard() {
  return (
    <div className="ct-root not-prose">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>

      <style>{`
        .ct-root {
          margin: 2rem 0;
          border: 1px solid #ece6d8;
          border-radius: 0.9rem;
          overflow: hidden;
          background: #fcfbf7;
          font-family: 'Inter', sans-serif;
        }
        .ct-toolbar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.7rem 0.8rem;
          border-bottom: 1px solid #ece6d8;
          background: #fff;
        }
        .ct-search { position: relative; display: flex; align-items: center; }
        .ct-search input {
          width: 15rem;
          max-width: 60vw;
          font-size: 0.8rem;
          padding: 0.36rem 1.6rem 0.36rem 1.9rem;
          border: 1px solid #e7e1d3;
          border-radius: 0.5rem;
          background: #fcfbf7;
          outline: none;
          color: #292524;
        }
        .ct-search input:focus { border-color: #b8b2a3; background: #fff; }
        .ct-search-ic {
          position: absolute; left: 0.6rem; width: 0.9rem; height: 0.9rem; color: #a8a29e;
        }
        .ct-clear {
          position: absolute; right: 0.45rem; display: inline-flex; color: #a8a29e;
          background: none; border: none; cursor: pointer;
        }
        .ct-clear span { width: 0.9rem; height: 0.9rem; }
        .ct-canvas { height: 600px; width: 100%; background: #fafaf7; }

        .ct-card {
          display: flex;
          align-items: stretch;
          background: #fff;
          border: 1px solid #e7e1d3;
          border-radius: 0.55rem;
          box-shadow: 0 1px 2px rgba(60, 50, 30, 0.05);
          font-size: 0.8rem;
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ct-clickable { cursor: pointer; }
        .ct-clickable:hover { border-color: #cfc8b6; box-shadow: 0 2px 8px rgba(60,50,30,0.09); }
        .ct-matched { border-color: #d6b35a; box-shadow: 0 0 0 2px rgba(214,179,90,0.35); }
        .ct-card { transition: border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, filter 0.18s ease; }
        .ct-linked { box-shadow: 0 0 0 2px rgba(60,50,30,0.18), 0 2px 10px rgba(60,50,30,0.12); }
        .ct-dimmed { opacity: 0.35; }
        .ct-blurred { opacity: 0.32; filter: blur(2px); }
        .ct-focused { box-shadow: 0 0 0 2.5px rgba(60,50,30,0.4), 0 4px 14px rgba(60,50,30,0.18); }
        .ct-label-wrap {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.45rem 0.55rem; min-width: 0; flex: 1;
        }
        .ct-ic { width: 0.9rem; height: 0.9rem; flex: none; }
        .ct-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ct-chev {
          width: 0.9rem; height: 0.9rem; align-self: center;
          margin-right: 0.5rem; color: #a8a29e;
          transition: transform 0.2s ease;
        }
        .ct-chev.ct-open { transform: rotate(180deg); }
        .ct-handle {
          width: 6px; height: 6px;
          background: #fff; border: 1px solid #b8b2a3;
        }
        .ct-handle-hidden { opacity: 0; pointer-events: none; }
        .ct-root .react-flow__controls {
          box-shadow: 0 1px 4px rgba(60,50,30,0.12);
          border-radius: 0.5rem; overflow: hidden; border: 1px solid #e7e1d3;
        }
        .ct-root .react-flow__controls-button {
          background: #fff; border-bottom: 1px solid #ece6d8; color: #57534e;
        }
        .ct-root .react-flow__controls-button:hover { background: #f5f3ec; }
      `}</style>
    </div>
  )
}
