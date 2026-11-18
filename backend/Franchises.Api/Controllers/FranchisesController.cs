using Franchises.Api.Data;
using Franchises.Api.DTOs;
using Franchises.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Franchises.Api.Controllers;
[ApiController, Route("api/[controller]")]
public class FranchisesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Franchise>>> GetAll() =>
        Ok(await db.Franchises.AsNoTracking().OrderBy(x => x.Name).ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Franchise>> GetById(int id)
    {
        var item = await db.Franchises.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return item is null ? NotFound(new { message = "Franchise not found." }) : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Franchise>> Create(CreateFranchiseRequest request)
    {
        var item = new Franchise { Name = request.Name.Trim() };
        db.Franchises.Add(item); await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }
}
