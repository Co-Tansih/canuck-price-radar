import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Activity,
  DollarSign,
  Eye,
  ShoppingCart,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UserManagement = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 2847,
    activeUsers: 1456,
    newUsers: 234,
    growthRate: 12.5
  });
  
  const [users] = useState([
    {
      id: '1',
      email: 'john.doe@example.com',
      full_name: 'John Doe',
      subscription: 'user',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith',
      subscription: 'user',
      created_at: '2024-01-20'
    },
    {
      id: '3',
      email: 'admin@pricetrackr.ca',
      full_name: 'Admin User',
      subscription: 'admin',
      created_at: '2024-01-01'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const statsCards = [
    {
      title: t('totalUsers') || 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('activeUsers') || 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('newUsers') || 'New Users',
      value: stats.newUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: t('userGrowth') || 'User Growth',
      value: `${stats.growthRate}%`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('userManagement') || 'User Management'}
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          {t('manageUserAccounts') || 'Manage user accounts and access permissions'}
        </p>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t('userList') || 'User List'}</CardTitle>
          <CardDescription>
            {t('manageUserAccountsAndPermissions') || 'Manage user accounts and their permissions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t('name') || 'Name'}</TableHead>
                <TableHead>{t('email') || 'Email'}</TableHead>
                <TableHead>{t('subscription') || 'Subscription'}</TableHead>
                <TableHead className="text-right">{t('actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.subscription}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions') || 'Actions'}</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> {t('edit') || 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" /> {t('delete') || 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, stats.totalUsers)} of {stats.totalUsers} users
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserManagement;