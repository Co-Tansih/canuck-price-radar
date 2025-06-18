
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Shield,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    newUsersThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users from profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process users data
      const processedUsers = profiles?.map(profile => {
        // Get user searches count
        const getSearchCount = async (userId) => {
          const { count } = await supabase
            .from('search_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
          return count || 0;
        };

        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User',
          email: profile.email || 'No email',
          role: profile.role || 'user',
          status: 'active', // Default status
          joinDate: new Date(profile.created_at).toISOString().split('T')[0],
          lastLogin: formatTimeAgo(profile.updated_at),
          searches: 0, // Will be updated
          priceAlerts: Math.floor(Math.random() * 50) // Mock data for now
        };
      }) || [];

      // Calculate stats
      const totalUsers = processedUsers.length;
      const activeUsers = processedUsers.filter(u => u.status === 'active').length;
      const premiumUsers = processedUsers.filter(u => u.role === 'premium').length;
      
      // Calculate new users this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newUsersThisWeek = processedUsers.filter(u => 
        new Date(u.joinDate) >= oneWeekAgo
      ).length;

      setUsers(processedUsers);
      setUserStats({
        totalUsers,
        activeUsers,
        premiumUsers,
        newUsersThisWeek
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hrs ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const roles = ['All', 'user', 'premium', 'moderator', 'admin'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const variants = {
      user: 'bg-gray-100 text-gray-800',
      premium: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[role] || variants.user}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status] || variants.inactive}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Manage user accounts and access levels
          </p>
        </div>
        <Button className="flex items-center space-x-2 text-sm">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* User Stats - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {userStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {userStats.activeUsers}
                </p>
                <p className="text-xs md:text-sm text-green-600">
                  {userStats.totalUsers > 0 ? 
                    ((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1) : 0}% active
                </p>
              </div>
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Premium Users</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {userStats.premiumUsers}
                </p>
                <p className="text-xs md:text-sm text-purple-600">
                  {userStats.totalUsers > 0 ? 
                    ((userStats.premiumUsers / userStats.totalUsers) * 100).toFixed(1) : 0}% premium
                </p>
              </div>
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {userStats.newUsersThisWeek}
                </p>
                <p className="text-xs md:text-sm text-blue-600">This week</p>
              </div>
              <UserPlus className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Mobile Responsive */}
      <Card className="glass-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'All' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" className="flex items-center space-x-2 text-sm">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table - Mobile Responsive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-sm">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{user.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500">Joined</p>
                    <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Login</p>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Searches</p>
                    <p className="font-medium">{user.searches}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Alerts</p>
                    <p className="font-medium">{user.priceAlerts}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{user.searches} searches</p>
                        <p className="text-gray-500">{user.priceAlerts} alerts</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{user.lastLogin}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
