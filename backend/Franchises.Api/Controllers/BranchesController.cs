using Franchises.Api.Data;
using Franchises.Api.DTOs;
using Franchises.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Franchises.Api.Controllers;
[ApiController, Route("api/[controller]")]
public class BranchesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Branch>>> GetAll([FromQuery] int? franchiseId)
    {
        var query = db.Branches.AsNoTracking().AsQueryable();
        if (franchiseId.HasValue) query = query.Where(x => x.FranchiseId == franchiseId.Value);
        return Ok(await query.OrderBy(x => x.Name).ToListAsync());
    }
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Branch>> GetById(int id)
    {
        var item = await db.Branches.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return item is null ? NotFound(new { message = "Branch not found." }) : Ok(item);
    }
    [HttpPost]
    public async Task<ActionResult<Branch>> Create(CreateBranchRequest request)
    {
        if (!await db.Franchises.AnyAsync(x => x.Id == request.FranchiseId))
            return BadRequest(new { message = "The selected franchise does not exist." });
        var item = new Branch { FranchiseId = request.FranchiseId, Name = request.Name.Trim() };
        db.Branches.Add(item); await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }
}
