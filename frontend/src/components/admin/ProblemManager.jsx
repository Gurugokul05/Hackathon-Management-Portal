import React, { useState } from 'react';
import api from '../../services/api';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import Swal from 'sweetalert2';

const ProblemManager = () => {
    const [formData, setFormData] = useState({ title: '', domain: '', difficulty: 'Medium', description: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/problems', formData);
            Swal.fire({
                icon: 'success',
                title: 'Problem Deployed',
                text: 'The problem statement is now live.',
                background: 'var(--bg-secondary)',
                color: '#fff'
            });
            setFormData({ title: '', domain: '', difficulty: 'Medium', description: '' });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Deployment Failed',
                text: 'Could not add problem.',
                background: 'var(--bg-secondary)',
                color: '#fff'
            });
        }
    };

    return (
        <Card title="Add Problem Statement">
            <form onSubmit={handleSubmit}>
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
                <Input label="Domain" name="domain" value={formData.domain} onChange={handleChange} required placeholder="e.g. AI/ML, Web3" />
                
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Difficulty</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)' }}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)' }} />
                </div>

                <Button type="submit">Add Problem</Button>
            </form>
        </Card>
    );
};

export default ProblemManager;
