using System;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using waterchat.Models;

namespace waterchat.Data
{
    public class WaterChatPostgresContext : IdentityDbContext
    {
        public WaterChatPostgresContext(DbContextOptions<WaterChatPostgresContext> options) : base(options)
        {
        }

        public DbSet<Message> Message { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Message>()
                .Property(m => m.DateCreated);

            // shadow properties

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            ChangeTracker.DetectChanges();

            updateUpdatedProperty<Message>();

            return base.SaveChanges();
        }

        private void updateUpdatedProperty<T>() where T : class
        {
            var modifiedSourceInfo =
                ChangeTracker.Entries<T>()
                    .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in modifiedSourceInfo)
            {
                entry.Property("UpdatedTimestamp").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
