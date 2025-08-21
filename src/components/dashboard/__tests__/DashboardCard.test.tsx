import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardCard, { DashboardIcons } from '../DashboardCard';

describe('DashboardCard', () => {
  const defaultProps = {
    title: 'Test Card',
    value: 100,
    icon: DashboardIcons.orders,
    iconColor: 'brand-orange' as const,
    valueColor: 'base-content' as const
  };

  it('renders basic card with title and value', () => {
    render(<DashboardCard {...defaultProps} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with string value', () => {
    render(<DashboardCard {...defaultProps} value="$1,234" />);
    
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('renders with trend indicator', () => {
    const trend = {
      value: 12.5,
      label: 'vs last week',
      isPositive: true
    };
    
    render(<DashboardCard {...defaultProps} trend={trend} />);
    
    expect(screen.getByText('↗ 12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs last week')).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    const trend = {
      value: 8.2,
      label: 'vs last week',
      isPositive: false
    };
    
    render(<DashboardCard {...defaultProps} trend={trend} />);
    
    expect(screen.getByText('↘ 8.2%')).toBeInTheDocument();
  });

  it('renders as clickable button when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<DashboardCard {...defaultProps} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as non-clickable div when onClick is not provided', () => {
    render(<DashboardCard {...defaultProps} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DashboardCard {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    // Check for skeleton element
    expect(document.querySelector('.skeleton')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    render(<DashboardCard {...defaultProps} iconColor="success" valueColor="warning" />);
    
    const valueElement = screen.getByText('100');
    expect(valueElement).toHaveClass('text-warning');
  });

  it('formats numbers with locale formatting', () => {
    render(<DashboardCard {...defaultProps} value={1234567} />);
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    const handleClick = jest.fn();
    render(<DashboardCard {...defaultProps} onClick={handleClick} loading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<DashboardCard {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders icon when provided', () => {
    render(<DashboardCard {...defaultProps} />);
    
    // Check that SVG icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without icon when not provided', () => {
    const { icon: _icon, ...propsWithoutIcon } = defaultProps;
    render(<DashboardCard {...propsWithoutIcon} />);
    
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });
});
