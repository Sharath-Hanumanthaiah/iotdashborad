import { useDashboard } from '../../context/DashboardContext';
import { DEVICE_TYPES, REGIONS } from '../../utils/constants';
import { IoSearchOutline, IoCloseCircleOutline } from 'react-icons/io5';

export default function TableFilters() {
  const { tableFilters, setTableFilters, resetTableFilters } = useDashboard();

  const handleSearch = (e) => {
    setTableFilters({ search: e.target.value });
  };

  const handleSelect = (key) => (e) => {
    setTableFilters({ [key]: e.target.value });
  };

  const hasFilters = Object.values(tableFilters).some(v => v !== '' && v !== null);

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <IoSearchOutline style={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search by ID, name, or message..."
          className="search-input"
          value={tableFilters.search}
          onChange={handleSearch}
        />
      </div>

      <div style={styles.filters}>
        <select
          className="filter-select"
          value={tableFilters.status}
          onChange={handleSelect('status')}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>

        <select
          className="filter-select"
          value={tableFilters.type}
          onChange={handleSelect('type')}
        >
          <option value="">All Types</option>
          {DEVICE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={tableFilters.region}
          onChange={handleSelect('region')}
        >
          <option value="">All Locations</option>
          {REGIONS.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            className="btn btn-ghost"
            style={{ padding: '4px 8px', color: 'var(--danger)' }}
            onClick={resetTableFilters}
            title="Clear Filters"
          >
            <IoCloseCircleOutline size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: 'var(--space-4)',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  searchBox: {
    position: 'relative',
    flex: '1 1 300px',
    maxWidth: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
  },
  filters: {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap'
  }
};
